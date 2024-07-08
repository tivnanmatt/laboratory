<?php

function rednao_smart_forms_get_campaigns()
{
    global $wpdb;
    $campaigns=$wpdb->get_results("select campaign_id, name from ".SMART_DONATIONS_CAMPAIGN_TABLE,'ARRAY_A');
    array_splice($campaigns,0,0,array(array(
                                    "campaign_id"=>"",
                                    "name"=>__("None"))
    ));
    echo json_encode($campaigns);
    die();
}