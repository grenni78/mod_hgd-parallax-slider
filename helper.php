<?php
/*------------------------------------------------------------------------------------------------------/
				Holger Genth -Dienstleistungen-
/-------------------------------------------------------------------------------------------------------/

	@version		1.1.0
	@created		7th July, 2017
	@package		mod_hgd-parallax-slider
	@author			Holger Genth <https://holger-genth.de/joomla>
	@copyright		Copyright (C) 2017. All Rights Reserved
	@license		GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html
/------------------------------------------------------------------------------------------------------*/

// No direct access
defined('_JEXEC') or die;

class ModHgdParallaxSlider {
    // Bereitet Daten für das Plugin vor
    public static function prepare($params) {
      $OPTIONS = array(
        "container" => array(
          "width" => $params->get("width"),
          "height" => $params->get("height"),
          "maxWidth" => $params->get("max_width"),
          "maxHeight" => $params->get("max_height"),

        ),
        "stage" => array(
          "desiredPan" => $params->get("sizeFactor"),
          "fov" => $params->get("fov")
        ),
        "layerCount" => $params->get("layer_count"),
        "autoHeight" => ($params->get("height") == "auto")
      );

      $STAGES = array();

      for ($i=0; $i < $OPTIONS["layerCount"]; $i++) {

        $STAGES[$i] = array(
          "src" => $params->get("image".($i+1)),
          "distance" => $params->get("distance".($i+1)),
          "size" => array("width" => 0, "height" => 0),
          "aspect" => 1,
          "desc" => ""
        );
      }

      usort($STAGES, function($a, $b) {
        if ($a["distance"] == $b["distance"]) {
          return 0;
        } else if ($a["distance"] > $b["distance"]) {
          return -1;
        } else if ($a["distance"] < $b["distance"]) {
          return 1;
        }
      });

      for ($i = 0; $i < count($STAGES); $i++) {
        // Größe der Bilder ermitteln und speichern
        $imagesize = @getimagesize($_SERVER["DOCUMENT_ROOT"].'/'.$STAGES[$i]["src"]);

        if (is_array($imagesize) && count($imagesize)>=2) {

          $STAGES[$i]["size"]["width"] = $imagesize[0];
          $STAGES[$i]["size"]["height"] = $imagesize[1];
          $STAGES[$i]["aspect"] = $imagesize[0] / $imagesize[1];
          $STAGES[$i]["css"] = array();


        } else { // if (is_array

          $STAGES = array_splice($STAGES,$i,1);

        }

      } // for

      $maxWidth = ( $OPTIONS["container"]["maxWidth"] !==0 )  ? "max-width: ".$OPTIONS["container"]["maxWidth"] : "";
      $maxHeight = ( $OPTIONS["container"]["maxHeight"] !==0 )  ? "max-height: ".$OPTIONS["container"]["maxHeight"] : "";

      // add necessary files to the document
      JHtml::_('jquery.framework');

      $doc = JFactory::getDocument();
      if (JDEBUG) {
        $doc->addScript(JURI::base()."modules/mod_hgd-parallax-slider/assets/js/jquery.easing.1.3.js");
        $doc->addScript(JURI::base()."modules/mod_hgd-parallax-slider/assets/js/mod_hgd-parallax-slider.js");
      } else {
        $doc->addScript(JURI::base()."modules/mod_hgd-parallax-slider/assets/js/jquery.easing.1.3.min.js");
        $doc->addScript(JURI::base()."modules/mod_hgd-parallax-slider/assets/js/mod_hgd-parallax-slider.min.js");
      }

      $doc->addScriptDeclaration("
        (function($){
          $(document).ready(function(){
            var stages = ".json_encode($STAGES).";
            var config = ".json_encode($OPTIONS).";

            $('#parallax-container').hgdParallaxSlider($.extend({
              'stages': stages,
              'maxSizeRatio': config.stage.desiredPan
            },config));
          });
        })(jQuery);
      ");

      $doc->addStyleDeclaration("
        #parallax-container {
          position:relative;
          width:". $OPTIONS["container"]["width"] .";
          height:". $OPTIONS["container"]["height"] .";
          ". $maxWidth ."px;
          ". $maxHeight ."px;
          overflow:hidden;
        }
        #parallax-container .stage {
          position: absolute;
          left: 0;
          top: 0;
          width: auto;
        }
        #parallax-container .stage img {
          width: auto;
          height: 100%;
          margin: 0;
        }
      ");

      return $STAGES;
    }
}
