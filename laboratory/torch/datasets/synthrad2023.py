from ..samplers import Sampler
import numpy as np
import torch
import os
import nibabel as nib




class SynthRad2023Task1CTSlice_Dataset(torch.utils.data.Dataset):
    def __init__(self, root_dir, verbose=False):
        self.root_dir = root_dir
        brain_list = os.listdir(root_dir)
        # remove the element of self.brain_list that is 'overview'
        brain_list.remove('overview')
        # Split the list into training and testing
        np.random.seed(2023)
        np.random.shuffle(brain_list)  # Shuffle the list 
        self.verbose = verbose
        self.brain_list = brain_list
        self.active_filename = None
        self.active_data = None
        self.top_of_head = None
        self.slices_per_volume = 60

    def __len__(self):
        return len(self.brain_list)*self.slices_per_volume
    
    def __getitem__(self, idx):
        if type(idx) == int:
            idx = [idx]
        elif type(idx) == slice:
            if idx.step is None:
                idx = range(idx.start, idx.stop)
            else:
                idx = range(idx.start, idx.stop, idx.step)
        
        # initialize the patch volume
        brain_ct_slices = np.zeros((len(idx), 256, 256)) - 1000

        # load in the brain patches
        for i, ind in enumerate(idx):
            iVolume = ind//self.slices_per_volume
            iSlice = ind%self.slices_per_volume
            # if self.verbose:
                # print('Loading brain volume %d/%d' % (iVolume+1, len(self.brain_list)))
            # brain_patches[i] = self._load_brain_patch(ind)
            brain_dir = os.path.join(self.root_dir, self.brain_list[iVolume])
            ct_path = os.path.join(brain_dir, 'ct.nii.gz')
            if self.active_filename != ct_path:
                if self.verbose:
                    print('loading file %s' % ct_path)
                ct_data = nib.load(ct_path).get_fdata()
                if ct_data.shape[0] > 256:
                    _iSlice = (ct_data.shape[0] - 256) // 2
                    ct_data = ct_data[_iSlice:_iSlice+256]
                if ct_data.shape[1] > 256:
                    _iRow = (ct_data.shape[1] - 256) // 2
                    ct_data = ct_data[:, _iRow:_iRow+256]
                if ct_data.shape[2] > 256:
                    _iCol = (ct_data.shape[2] - 256) // 2
                    ct_data = ct_data[:, :, _iCol:_iCol+256]
                # now handle the case where it is <256 by inserting it into a 256x256x256 volume on center
                _iSlice = (256 - ct_data.shape[0]) // 2
                _iRow = (256 - ct_data.shape[1]) // 2
                _iCol = (256 - ct_data.shape[2]) // 2
                _ct_data = np.zeros((256, 256, 256)) - 1000
                _ct_data[_iSlice:_iSlice+ct_data.shape[0], _iRow:_iRow+ct_data.shape[1], _iCol:_iCol+ct_data.shape[2]] = ct_data
                
                self.active_data = _ct_data
                self.active_filename = ct_path

            
                self.top_of_head = 0
                for ii in range(256):
                    if self.active_data[:,:,ii].mean() > -900:
                        self.top_of_head = ii

                # first 30 slices dont have much brain
                self.top_of_head -= 30

            # brain_ct_slices[i] = self.active_data[:,:,self.top_of_head-iSlice]
            # transpose it 
            brain_ct_slices[i] = self.active_data[:,:,self.top_of_head-iSlice].T

        brain_ct_slices = torch.tensor(brain_ct_slices, dtype=torch.float32)
        
        # channel dimension
        brain_ct_slices = brain_ct_slices.unsqueeze(1)

        # rescale
        # brain_ct_slices = (brain_ct_slices) / 1000

        return brain_ct_slices
    