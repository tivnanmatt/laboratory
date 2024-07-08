<?php

add_action( 'widgets_init', 'rednao_forms_register_widget' );

function rednao_forms_register_widget()
{
    register_widget('rednao_smart_forms_widget');
}

class rednao_smart_forms_widget extends WP_Widget
{
    function __construct()
    {
        $widget_ops = array(
            'classname' => 'rednao_smart_forms_widget', 'description' => 'Let you insert forms in any area'
        );
        parent::__construct('rednao_smart_forms_widget', 'Smart Forms',$widget_ops );
    }

    function form($instance)
    {
        $defaults = array( 'form_id' => '0','title'=>'' );
        $instance = wp_parse_args( (array) $instance, $defaults );
        $id = $instance['form_id'];
        $title=$instance['title'];

        global $wpdb;
        $results =$wpdb->get_results('select form_id,form_name from '.SMART_FORMS_TABLE_NAME);

        ?>

        <p class="description">
            <?php echo __("Select a form."); ?>
        </p>
        <p><?php echo __("Title"); ?>
            <input class="widefat" type="text" name="<?php echo $this->get_field_name("title");?>" value="<?php echo $title;?>"/>
        </p>

        <?php
        echo "<select class='widefat' name='".$this->get_field_name("form_id")."'>";
        foreach($results as $result)
        {
            echo "<option  value='$result->form_id'".($id==$result->form_id?" selected='sel'":"" ).">";
            echo  $result->form_name;
            echo "</option>";
        }
        echo "</select>";
    }

    function update($new_instance, $old_instance)
    {
        $new_instance['title'] =strip_tags($new_instance['title']);
        $new_instance['form_id'] =strip_tags($new_instance['form_id']);

        delete_transient("rednao_smart_forms_".$new_instance['form_id']);
        return $new_instance;
    }

    function widget($args, $instance) { // displays the widget
        $id=$instance['form_id'];
        require_once(SMART_FORMS_DIR."smart-forms-helpers.php");
        return rednao_smart_forms_load_form($instance['title'],$id,false);
    }


}
?>