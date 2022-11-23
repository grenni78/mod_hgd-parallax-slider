<?php
// No direct access
defined('_JEXEC') or die;
?>

<div id="parallax-container" class="col-lg-12 col-sm-12 col-xs-12">
<?php
foreach ($STAGES as $idx => $stage) {
  echo " <div class=\"stage\"><img src=\"" . $stage["src"] . "\" alt=\"". $stage["desc"] ."\"/></div>\n";
}
?>
</div>
