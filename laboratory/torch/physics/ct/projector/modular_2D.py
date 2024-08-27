import torch
import torch.nn as nn
import numpy as np

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class ModularFanBeamCTProjector(nn.Module):
    """
    Perform 2D modular fan beam CT forward and back projection.

    Args:
        num_image_rows (int): The number of image rows (constant for all views).
        num_image_cols (int): The number of image columns (constant for all views).
        voxel_row_spacing (float or tensor): The spacing between voxel rows.
        voxel_col_spacing (float or tensor): The spacing between voxel columns.
        num_detector_columns (int): The number of detector pixel columns (constant for all views).
        detector_column_spacing (float or tensor): The spacing between detector columns (constant for all views).
        image_center (torch.Tensor or np.ndarray): A tensor or ndarray of shape (2,) representing the 2D position of the image center.
        image_col_direction (torch.Tensor or np.ndarray): A tensor or ndarray of shape (2,) representing the 2D direction vector of positive image columns.
        source_positions (torch.Tensor or np.ndarray): A tensor or ndarray of shape (num_views, num_sources, 2) representing the 2D source positions for each view.
        detector_center_positions (torch.Tensor or np.ndarray): A tensor or ndarray of shape (num_views, num_detectors, 2) representing the 2D detector positions for each detector module for each view.
        detector_column_directions (torch.Tensor or np.ndarray): A tensor or ndarray of shape (num_views, num_detectors, 2) representing the 2D direction vectors of the detector columns for each module for each view.
    """
    def __init__(self, 
             num_image_rows: int,
             num_image_cols: int,
             voxel_row_spacing: float,
             voxel_col_spacing: float,
             num_detector_columns: int,
             detector_column_spacing: float,
             image_center: torch.Tensor or np.ndarray,
             image_col_direction: torch.Tensor or np.ndarray,
             source_positions: torch.Tensor or np.ndarray,
             detector_center_positions: torch.Tensor or np.ndarray,
             detector_column_directions: torch.Tensor or np.ndarray,
             device='cpu'):
        
        super(ModularFanBeamCTProjector, self).__init__()

        # Ensure all spacing values are floats
        if isinstance(voxel_row_spacing, (torch.Tensor, np.ndarray)):
            voxel_row_spacing = float(voxel_row_spacing)
        if isinstance(voxel_col_spacing, (torch.Tensor, np.ndarray)):
            voxel_col_spacing = float(voxel_col_spacing)
        if isinstance(detector_column_spacing, (torch.Tensor, np.ndarray)):
            detector_column_spacing = float(detector_column_spacing)

        # Assertions for scalar inputs
        assert isinstance(num_image_rows, int), "num_image_rows must be an integer."
        assert isinstance(num_image_cols, int), "num_image_cols must be an integer."
        assert isinstance(voxel_row_spacing, float), "voxel_row_spacing must be a float."
        assert isinstance(voxel_col_spacing, float), "voxel_col_spacing must be a float."
        assert isinstance(num_detector_columns, int), "num_detector_columns must be an integer."
        assert isinstance(detector_column_spacing, float), "detector_column_spacing must be a float."

        # Convert numpy arrays to torch tensors if necessary
        if isinstance(image_center, np.ndarray):
            image_center = torch.tensor(image_center)
        if isinstance(image_col_direction, np.ndarray):
            image_col_direction = torch.tensor(image_col_direction)
        if isinstance(source_positions, np.ndarray):
            source_positions = torch.tensor(source_positions)
        if isinstance(detector_center_positions, np.ndarray):
            detector_center_positions = torch.tensor(detector_center_positions)
        if isinstance(detector_column_directions, np.ndarray):
            detector_column_directions = torch.tensor(detector_column_directions)

        # Validate tensor shapes
        assert image_center.shape == (2,), "image_center must be a 2D vector."
        assert image_col_direction.shape == (2,), "image_col_direction must be a 2D vector."
        assert len(source_positions.shape) == 3, "source_positions must be a 3D tensor with shape (num_views, num_sources, 2)."
        assert source_positions.shape[2] == 2, "source_positions must be a 3D tensor with shape (num_views, num_sources, 2)."
        num_sources = source_positions.shape[1]
        num_views = source_positions.shape[0]
        
        assert len(detector_center_positions.shape) == 3 and detector_center_positions.shape[2] == 2, "detector_center_positions must be a 3D tensor with shape (num_views, num_detectors, 2)."
        assert len(detector_column_directions.shape) == 3, "detector_column_directions must be a 3D tensor with shape (num_views, num_detectors, 2)."
        assert detector_column_directions.shape[2] == 2, "detector_column_directions must be a 3D tensor with shape (num_views, num_detectors, 2)."
        assert detector_center_positions.shape[0] == num_views, "num_views must be consistent across source_positions and detector_center_positions."
        num_detectors = detector_center_positions.shape[1]

        assert num_detectors == detector_column_directions.shape[1], "num_detectors must be consistent across detector_center_positions and detector_column_directions."

        # Store the inputs as attributes of the module
        self.num_views = num_views
        self.num_sources = num_sources
        self.num_detectors = num_detectors

        self.num_image_rows = num_image_rows
        self.num_image_cols = num_image_cols
        self.voxel_row_spacing = voxel_row_spacing
        self.voxel_col_spacing = voxel_col_spacing
        self.image_center = image_center
        self.image_col_direction = image_col_direction
        self.image_row_direction = torch.tensor([-image_col_direction[1], image_col_direction[0]]).to(device)

        self.num_sources = source_positions.shape[1]
        self.source_positions = source_positions.to(device)

        self.num_detectors = detector_center_positions.shape[1]
        self.num_detector_columns = num_detector_columns
        self.detector_column_spacing = detector_column_spacing
        self.detector_center_positions = detector_center_positions.to(device)
        self.detector_column_directions = detector_column_directions.to(device)

        # Calculate detector normal directions
        self.detector_normal_directions = torch.zeros(self.num_views, self.num_detectors, 2).to(device)
        self.detector_normal_directions[:, :, 0] = -self.detector_column_directions[:, :, 1]
        self.detector_normal_directions[:, :, 1] = self.detector_column_directions[:, :, 0]
        
        self.device = device
        
        self.projection_matrices = self.build_projection_matrices()

        self.voxel_zero_position = self.image_center \
                                - 0.5 * (self.num_image_rows - 1) * self.voxel_row_spacing * self.image_row_direction \
                                - 0.5 * (self.num_image_cols - 1) * self.voxel_col_spacing * self.image_col_direction

        # Initialize detector zero positions
        self.detector_zero_positions = torch.zeros(self.num_views, self.num_detectors, 2).to(self.device)
        for iView in range(self.num_views):
            for iDetector in range(self.num_detectors):
                self.detector_zero_positions[iView, iDetector] = self.detector_center_positions[iView, iDetector] \
                        - 0.5 * (self.num_detector_columns - 1) * self.detector_column_spacing * self.detector_column_directions[iView, iDetector]
    
    def build_projection_matrices(self):
        source_positions = self.source_positions.unsqueeze(2).unsqueeze(3)
        detector_center_positions = self.detector_center_positions.unsqueeze(1).unsqueeze(3)
        detector_column_directions = self.detector_column_directions.unsqueeze(1).unsqueeze(3)

        num_points = 4
        object_points = torch.zeros(num_points, 2, device=self.device)
        angles = torch.linspace(0.0, 2.0 * np.pi, num_points, dtype=torch.float32, device=self.device)
        object_points[:, 0] = self.image_center[0] + 0.5 * self.voxel_row_spacing * torch.cos(angles)
        object_points[:, 1] = self.image_center[1] + 0.5 * self.voxel_col_spacing * torch.sin(angles)
        object_points = object_points.unsqueeze(0).unsqueeze(1).unsqueeze(2)

        ref_depth = torch.sum(detector_center_positions * detector_column_directions, dim=-1, keepdim=True)
        source_depth = torch.sum(source_positions * detector_column_directions, dim=-1, keepdim=True)
        object_depth = torch.sum(object_points * detector_column_directions, dim=-1, keepdim=True)
        
        source_to_object_vector = object_points - source_positions
        extension_factor = (ref_depth - source_depth) / (object_depth - source_depth)
        intersection_points = source_positions + extension_factor * source_to_object_vector
        ref_offset = torch.sum(detector_center_positions * detector_column_directions, dim=-1, keepdim=True)
        intersection_offset = torch.sum(intersection_points * detector_column_directions, dim=-1, keepdim=True)

        projected_points = intersection_offset - ref_offset
        object_points = object_points.repeat(self.num_views, self.num_sources, self.num_detectors, 1, 1)
        object_points = object_points.view(self.num_views * self.num_sources * self.num_detectors, num_points, 2)
        projected_points = projected_points.view(self.num_views * self.num_sources * self.num_detectors, num_points, 1)
        
        object_points_T = object_points.transpose(1, 2)
        norm = object_points_T @ object_points
        inv_norm = torch.inverse(norm)
        projection_matrices = torch.matmul(torch.matmul(inv_norm, object_points_T), projected_points)

        self.projection_matrices = projection_matrices.view(self.num_views, self.num_sources, self.num_detectors, 1, 2)


    def point_projector(self, object_points: torch.Tensor):
        """
        Projects a set of points onto the detector.

        Args:
            object_points (torch.Tensor): A tensor of shape (num_points, 2) representing 2D points in the object.

        Returns:
            projected_points (torch.Tensor): A tensor of shape (num_views, num_sources, num_detectors, num_points, 1) representing the projected points on the detector.
        """

        # Validate input
        assert isinstance(object_points, torch.Tensor), "object_points must be a torch.Tensor."
        assert len(object_points.shape) == 2, "object_points must be a tensor of shape (num_points, 2)."
        assert object_points.shape[-1] == 2, "object_points must be a tensor of shape (num_points, 2)."

        # Reshape to (1, 1, 1, num_points, 2) to broadcast with the projection matrices
        object_points = object_points.unsqueeze(0).unsqueeze(1).unsqueeze(2).repeat(self.num_views, self.num_sources, self.num_detectors, 1, 1)

        # Flatten the projection matrices for efficient computation
        self.projection_matrices = self.projection_matrices.view(self.num_views * self.num_sources * self.num_detectors, 2, 1)

        # Flatten the object points for efficient computation
        object_points = object_points.view(self.num_views * self.num_sources * self.num_detectors, -1, 2)

        # Perform the matrix multiplication to project the points
        projected_points = torch.matmul(object_points, self.projection_matrices)

        # Reshape the output back to the original dimensions
        projected_points = projected_points.view(self.num_views, self.num_sources, self.num_detectors, -1, 1)

        # Reshape the projection matrices back to their original dimensions
        self.projection_matrices = self.projection_matrices.view(self.num_views, self.num_sources, self.num_detectors, 1, 2)

        return projected_points

    def build_system_response_matrix(self, num_voxels_per_ray=100, batch_size=1000):
        """
        Build the system response matrix for the CT projection.

        Args:
            num_voxels_per_ray (int): The maximum number of voxels to consider for each ray.
            batch_size (int): The batch size for processing voxels and rays.

        Returns:
            None: This method populates the system response matrix attributes.
        """
        self.num_voxels_per_ray = num_voxels_per_ray

        # Initialize grids for image rows and columns
        rowGrid, colGrid = torch.meshgrid(torch.arange(self.num_image_rows), torch.arange(self.num_image_cols))
        rowGrid = rowGrid.to(self.device).to(torch.float32).view(-1)
        colGrid = colGrid.to(self.device).to(torch.float32).view(-1)

        # Compute x and y coordinates of the grid points in world coordinates
        xGrid = self.voxel_zero_position[0] + colGrid * self.voxel_col_spacing * self.image_col_direction[0] \
                + rowGrid * self.voxel_row_spacing * self.image_row_direction[0]

        yGrid = self.voxel_zero_position[1] + colGrid * self.voxel_col_spacing * self.image_col_direction[1] \
                + rowGrid * self.voxel_row_spacing * self.image_row_direction[1]

        xGrid = xGrid.view(1, -1)
        yGrid = yGrid.view(1, -1)

        # Initialize matrices to store indices and weights of the system response
        self.system_response_matrix_iImageRow_index = torch.zeros(self.num_views, 
                                                                self.num_sources, 
                                                                self.num_detectors, 
                                                                self.num_detector_columns, 
                                                                self.num_voxels_per_ray, 
                                                                dtype=torch.int8).to(self.device)

        self.system_response_matrix_iDetectorCol_index = torch.zeros(self.num_views, 
                                                                    self.num_sources, 
                                                                    self.num_detectors, 
                                                                    self.num_detector_columns, 
                                                                    self.num_voxels_per_ray, 
                                                                    dtype=torch.int8).to(self.device)  

        self.system_response_matrix_weights = torch.zeros(self.num_views, 
                                                        self.num_sources, 
                                                        self.num_detectors, 
                                                        self.num_detector_columns,
                                                        self.num_voxels_per_ray, 
                                                        dtype=torch.float32).to(self.device)

        # Process in batches
        for iView in range(self.num_views):
            for iSource in range(self.num_sources):
                for iDetector in range(self.num_detectors):
                    for iColumn in range(self.num_detector_columns):

                        print(f"Processing view {iView}, source {iSource}, detector {iDetector}, column {iColumn}")

                        # Calculate the distance of each voxel from the ray
                        d = torch.abs((self.detector_center_positions[iView, iDetector, 0] - self.source_positions[iView, iSource, 0]) * (self.source_positions[iView, iSource, 1] - yGrid) 
                                    - (self.source_positions[iView, iSource, 0] - xGrid) * (self.detector_center_positions[iView, iDetector, 1] - self.source_positions[iView, iSource, 1])) \
                            / torch.sqrt((self.detector_center_positions[iView, iDetector, 0] - self.source_positions[iView, iSource, 0])**2 
                                        + (self.detector_center_positions[iView, iDetector, 1] - self.source_positions[iView, iSource, 1])**2)

                        d = d.view(-1)
                        # Find the indices of the closest voxels
                        d, indices = torch.topk(d, self.num_voxels_per_ray, largest=False)

                        row_indices = rowGrid[indices]
                        col_indices = colGrid[indices]

                        # Store the indices
                        self.system_response_matrix_iImageRow_index[iView, iSource, iDetector, iColumn] = row_indices
                        self.system_response_matrix_iDetectorCol_index[iView, iSource, iDetector, iColumn] = col_indices

                        # Compute and store the weights
                        self.system_response_matrix_weights[iView, iSource, iDetector, iColumn] = self.compute_system_response_weights(
                            row_indices, col_indices, torch.tensor([iView]).to(self.device), torch.tensor([iSource]).to(self.device),
                            torch.tensor([iDetector]).to(self.device), torch.tensor([iColumn]).to(self.device)
                        )


    def build_projection_matrices(self):
        """
        Compute projection matrices for all source-detector pairs for all views.

        Returns:
            torch.Tensor: A tensor of shape (num_views, num_sources, num_detectors, 1, 2) that projects 
                          a (x, y) point in the object to a (u) point on the detector.
        """
        # we are gonna take everything of various sizes and make it into: (num_views, num_sources, num_detectors, num_points, 2)
        source_positions = self.source_positions.unsqueeze(2).unsqueeze(3) # (num_views, num_sources, 2) -> (num_views, num_sources, 1, 1, 2)
        detector_center_positions = self.detector_center_positions.unsqueeze(1).unsqueeze(3) # (num_views, num_detectors, 2) -> (num_views, 1, num_detectors, 1, 2)
        detector_column_directions = self.detector_column_directions.unsqueeze(1).unsqueeze(3) # (num_views, num_detectors, 2) -> (num_views, 1, num_detectors, 1, 2)
        detector_normal_directions = self.detector_normal_directions.unsqueeze(1).unsqueeze(3) # (num_views, num_detectors, 2) -> (num_views, 1, num_detectors, 1, 2)

        num_points = 3
        object_points = torch.zeros(num_points, 2).to(self.device)
        angles = torch.linspace(0.0, 1.5 * np.pi, num_points, dtype=torch.float32).to(self.device)
        object_points[:, 0] = self.image_center[0] + 0.5 * self.voxel_row_spacing * torch.cos(angles)
        object_points[:, 1] = self.image_center[1] + 0.5 * self.voxel_col_spacing * torch.sin(angles)
        object_points = object_points.unsqueeze(0).unsqueeze(1).unsqueeze(2) # (1, 1, 1, 3, 2)

        ref_depth = torch.sum(detector_center_positions * detector_normal_directions, dim=-1, keepdim=True) # (num_views, 1, num_detectors, 1, 1)
        source_depth = torch.sum(source_positions * detector_normal_directions, dim=-1, keepdim=True) # (num_views, num_sources, num_detectors, 1, 1)
        object_depth = torch.sum(object_points * detector_normal_directions, dim=-1, keepdim=True) # (num_views, 1, num_detectors, num_points, 1)
        
        source_to_object_vector = object_points - source_positions # (num_views, num_sources, num_detectors, num_points, 2)

        extension_factor = (ref_depth - source_depth) / (object_depth - source_depth) # (num_views, num_sources, num_detectors, num_points, 1)

        intersection_points = source_positions + extension_factor * source_to_object_vector # (num_views, num_sources, num_detectors, num_points, 2)

        # take dot product with the detector column direction, and subtract the detector col reference to get the projected position
        ref_offset = torch.sum(detector_center_positions * detector_column_directions, dim=-1, keepdim=True) # (num_views, 1, num_detectors, 1, 1)
        intersection_offset = torch.sum(intersection_points * detector_column_directions, dim=-1, keepdim=True) # (num_views, num_sources, num_detectors, num_points, 1)

        projected_points = intersection_offset - ref_offset # (num_views, num_sources, num_detectors, num_points, 1)

        # for every view, source, detector, there is one projection matrix of size (1, 2)
        # so for each case we have an equation like
        #    u = xy @ A
        # where xy is the object point of shape (num_points, 2)
        # where A is the projection matrix of shape (1, 2)
        # where u is the projected point of shape (num_points, 1)
        # so we need to solve for A
        #   A = (xy.T @ xy)^-1 @ xy.T @ u

        # what we will do is reshape the num_views, num_sources, num_detectors, num_points, 2 to num_views*num_sources*num_detectors, num_points, 2
        # then use batch matrix multiplication to get the projection matrices

        object_points = object_points.repeat(self.num_views, self.num_sources, self.num_detectors, 1, 1) # (num_views, num_sources, num_detectors, num_points, 2)
        object_points = object_points.view(self.num_views * self.num_sources * self.num_detectors, num_points, 2) # (num_views * num_sources * num_detectors, num_points, 2)
        
        projected_points = projected_points.view(self.num_views * self.num_sources * self.num_detectors, num_points, 1) # (num_views * num_sources * num_detectors, num_points, 2)
        
        object_points_T = object_points.transpose(1, 2) # (num_views * num_sources * num_detectors, 2, num_points)
        norm = object_points_T @ object_points # (num_views * num_sources * num_detectors, 2, 2)
        inv_norm = torch.inverse(norm) # (num_views * num_sources * num_detectors, 2, 2)
        projection_matrices = torch.matmul(torch.matmul(inv_norm, object_points_T), projected_points) # (num_views * num_sources * num_detectors, 2, num_points)

        # now reshape it back to (num_views, num_sources, num_detectors, 1, 2)
        projection_matrices = projection_matrices.view(self.num_views, self.num_sources, self.num_detectors, 1, 2)

        return projection_matrices

    def build_system_response_matrix(self):
        """
        Build the system response matrix for the CT projection.

        Args:
            num_voxels_per_ray (int): The maximum number of voxels to consider for each ray.
            batch_size (int): The batch size for processing voxels and rays.

        Returns:
            None: This method populates the system response matrix attributes.
        """
        
        # Initialize grids for image rows and columns
        rowGrid, colGrid = torch.meshgrid(torch.arange(self.num_image_rows), torch.arange(self.num_image_cols))
        rowGrid = rowGrid.to(self.device).to(torch.float32).view(-1)
        colGrid = colGrid.to(self.device).to(torch.float32).view(-1)

        # Compute x and y coordinates of the grid points in world coordinates
        xGrid = self.voxel_zero_position[0] + colGrid * self.voxel_col_spacing * self.image_col_direction[0] \
                + rowGrid * self.voxel_row_spacing * self.image_row_direction[0]

        yGrid = self.voxel_zero_position[1] + colGrid * self.voxel_col_spacing * self.image_col_direction[1] \
                + rowGrid * self.voxel_row_spacing * self.image_row_direction[1]

        xGrid = xGrid.view(1, -1)
        yGrid = yGrid.view(1, -1)

        # Initialize matrices to store indices and weights of the system response
        self.system_response_matrix_iImageRow_index = torch.zeros(self.num_views, 
                                                                self.num_sources, 
                                                                self.num_detectors, 
                                                                self.num_detector_columns, 
                                                                self.num_voxels_per_ray, 
                                                                dtype=torch.int8).to(self.device)

        self.system_response_matrix_iDetectorCol_index = torch.zeros(self.num_views, 
                                                                    self.num_sources, 
                                                                    self.num_detectors, 
                                                                    self.num_detector_columns, 
                                                                    self.num_voxels_per_ray, 
                                                                    dtype=torch.int8).to(self.device)  

        self.system_response_matrix_weights = torch.zeros(self.num_views, 
                                                        self.num_sources, 
                                                        self.num_detectors, 
                                                        self.num_detector_columns,
                                                        self.num_voxels_per_ray, 
                                                        dtype=torch.float32).to(self.device)









if __name__ == '__main__':

    # Define the image center
    image_center = torch.tensor([0.0, 0.0]).to(device)

    # Define the image column direction
    image_col_direction = torch.tensor([1.0, 0.0]).to(device)  # Positive x-axis

    # Only one view, stationary CT
    num_views = 1

    # Define the source positions
    # 72 sources evenly spaced in a circle of radius 400.0
    num_sources = 72
    source_radius = 400.0
    angles = torch.linspace(0.0, 2.0 * np.pi, num_sources, dtype=torch.float32).to(device)
    source_positions = torch.zeros(num_views, num_sources, 2).to(device)
    source_positions[0, :, 0] = source_radius * torch.cos(angles)
    source_positions[0, :, 1] = source_radius * torch.sin(angles)

    # Define the detector positions
    # 72 detectors evenly spaced in a regular polygon of radius 325.0
    num_detectors = 72
    detector_radius = 325.0
    angles = torch.linspace(0.0, 2.0 * np.pi, num_detectors, dtype=torch.float32).to(device) + np.pi / num_detectors
    detector_center_positions = torch.zeros(num_views, num_detectors, 2).to(device)
    detector_center_positions[0, :, 0] = detector_radius * torch.cos(angles)
    detector_center_positions[0, :, 1] = detector_radius * torch.sin(angles)

    # Define the detector orientations
    detector_column_directions = torch.zeros(num_views, num_detectors, 2).to(device)
    detector_column_directions[0, :, 0] = -detector_center_positions[0, :, 1]
    detector_column_directions[0, :, 1] = detector_center_positions[0, :, 0]

    # Create the modular fan beam CT projector
    projector = ModularFanBeamCTProjector(
        num_image_rows=64,
        num_image_cols=64,
        voxel_row_spacing=4.0,
        voxel_col_spacing=4.0,
        image_center=image_center,
        image_col_direction=image_col_direction,
        source_positions=source_positions,
        num_detector_columns=128,
        detector_column_spacing=4.0,
        detector_center_positions=detector_center_positions,
        detector_column_directions=detector_column_directions,
        device=device
    )

    # Compute the projection matrices
    projection_matrices = projector.build_projection_matrices()

    # Define the points to project
    points = torch.tensor([
        [0.0, 0.0],
        [0.1, 0.1],
        [0.2, 0.2]
    ]).to(device)

    # Project the points
    projected_positions = projector.point_projector(points)

    print(projected_positions.shape)

    # Define the image center
    image_center = torch.tensor([0.0, 0.0]).to(device)

    # Define the image column direction
    image_col_direction = torch.tensor([1.0, 0.0]).to(device)  # Positive x-axis

    # 360 views, rotating CT
    num_views = 360

    # Define the source positions
    # One source on one side
    source_radius = 400.0
    angles = torch.linspace(0.0, 2.0 * np.pi, num_views, dtype=torch.float32).to(device)
    source_positions = torch.zeros(num_views, 1, 2).to(device)
    source_positions[:, 0, 0] = source_radius * torch.cos(angles)
    source_positions[:, 0, 1] = source_radius * torch.sin(angles)

    # Define the detector positions
    # One detector on the opposite side
    detector_radius = 400.0
    detector_center_positions = torch.zeros(num_views, 1, 2).to(device)
    detector_center_positions[:, 0, 0] = -source_radius * torch.cos(angles)
    detector_center_positions[:, 0, 1] = -source_radius * torch.sin(angles)

    # Define the detector orientations, orthogonal to the axis-to-detector vector
    detector_column_directions = torch.zeros(num_views, 1, 2).to(device)
    detector_column_directions[:, 0, 0] = -detector_center_positions[:, 0, 1]
    detector_column_directions[:, 0, 1] = detector_center_positions[:, 0, 0]

    # Create the modular fan beam CT projector
    projector = ModularFanBeamCTProjector(
        num_image_rows=64,
        num_image_cols=64,
        voxel_row_spacing=4.0,
        voxel_col_spacing=4.0,
        image_center=image_center,
        image_col_direction=image_col_direction,
        source_positions=source_positions,
        num_detector_columns=1,  # Only one detector column
        detector_column_spacing=4.0,
        detector_center_positions=detector_center_positions,
        detector_column_directions=detector_column_directions,
        device=device
    )

    # Compute the projection matrices
    projection_matrices = projector.build_projection_matrices()

    # Define the point to project (positive x-axis)
    point = torch.tensor([[0.2, 0.0]]).to(device)

    # Project the point
    projected_positions = projector.point_projector(point)

    print(projected_positions.shape)

    from matplotlib import pyplot as plt

    # Plot the projected points
    plt.figure(figsize=(6, 6))
    plt.plot(projected_positions[:, 0, 0, 0, 0].cpu().numpy())
    plt.xlabel('View')
    plt.ylabel('Projected Position')
    plt.title('Projected Position of a Point on the Detector')
    plt.savefig('projected_position.png')

    # Build the system response matrix
    projector.build_system_response_matrix(num_voxels_per_ray=100)