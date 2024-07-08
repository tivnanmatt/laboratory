<?php
class physical_file_uploader {
	function __construct()
	{
		require_once(ABSPATH . "wp-admin" . '/includes/file.php');
	}

	public function CreateFolderIfNeeded($path){
        if ( !@is_dir( $path ) ) {
            if(!@mkdir( $path ))
                return false;
            @file_put_contents( $path . '.htaccess', 'deny from all' );
            @touch( $path . 'index.php' );
            return true;
        }
        return true;
    }


    public function PutFile($path,$fileName)
    {

    }

	public function UploadFiles($entryData)
	{
        $upload_dir = wp_upload_dir();
	    $sfUploadDir=trailingslashit( $upload_dir['basedir'] ).'rednao_smartforms/';
	    if(!$this->CreateFolderIfNeeded($sfUploadDir))
        {
            return array("success"=>false,
                "entryData"=>"","cause"=>"Could not create upload folder");
        }

        $files=array();
		foreach($_FILES as $key=>$value)
		{

            $wp_filetype=wp_check_filetype_and_ext( $value['tmp_name'], $value['name'], false );
            $ext = empty( $wp_filetype['ext'] ) ? '' : $wp_filetype['ext'];
            $type = empty( $wp_filetype['type'] ) ? '' : $wp_filetype['type'];

            if ( ( ! $type || !$ext ) && ! current_user_can( 'unfiltered_upload' ) ) {
                return array("success"=>false,
                    "entryData"=>"","cause"=>"Invalid file type ".$ext);
            }

            $ext=pathinfo($value["name"], PATHINFO_EXTENSION);
            $originalFileName=$value['name'];

            $fileName=uniqid("",true).".".pathinfo($value["name"], PATHINFO_EXTENSION);
            $fileName=wp_unique_filename($sfUploadDir,$fileName);
            $id=md5(uniqid($fileName,true));

            if(@move_uploaded_file( $value['tmp_name'], $sfUploadDir.$fileName )===false)
            {
                return array("success"=>false,
                    "entryData"=>"","cause"=>"Could not upload a file to ".$fileName);
            }

			$splittedFiles=explode("@",$key);
			$fieldName=$splittedFiles[1];
            $imageNumber = $splittedFiles[2];
			if(strpos($fieldName,'_row_')===false)
            {

                $fieldElement =&$entryData[$fieldName][$imageNumber - 1];
            }else{
			    foreach($entryData as &$entryItem)
                {
                    if(is_array($entryItem)&&isset($entryItem['value']))
                    {
                        foreach($entryItem['value'] as &$repeaterRow)
                        {
                            if(isset($repeaterRow[$fieldName]))
                                $fieldElement=&$repeaterRow[$fieldName][$imageNumber-1];
                        }

                    }
                }
            }

            $fieldElement["path"]= admin_url('admin-ajax.php').'?action=rednao_sf_getfile&id='.$id;
            $fieldElement["type"]=$ext;
            $fieldElement["id"]=$id;
            $fieldElement["ppath"]=$sfUploadDir.$fileName;

            $files[]=array(
                'file_key'=>$id,
                'file_name'=>$sfUploadDir.$fileName,
                'original_name'=>$originalFileName,
                'file_mime'=>$type
            );

		}

		global $wpdb;
		foreach($files as $file)
        {
            if($wpdb->insert(SMART_FORMS_UPLOADED_FILES,$file)===false)
            {
                return array("success"=>false,
                    "entryData"=>"","cause"=>"Could not insert file into database ".$wpdb->last_error);
            }
        }

		return array("success"=>true,
					"entryData"=>$entryData);

	}

} 