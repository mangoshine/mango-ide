<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/mango.css">
  <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'>
<body>
  <div id="topBar">
    <a class="button" href="login">Log in with Github</a>
  </div>
  <div id="leftMenu"></div>
  <div id="tabBar">
    <a id="addNewFile" class="tab fontawesome-plus-sign" href="#"></a>
  </div>
  <div id="editor">
    <textarea id="lineNumbersPanel" readonly="true">1</textarea>
    <div id="currentLineHighlight"></div>
    <div id="editorOutput"><pre id="editorOutputText"></pre></div>
    <textarea id="editorInput" spellcheck="false" wrap="off"></textarea>
  </div>
  <div id="caret"></div>
  <span id="hiddenSpan">a</span>

  <script src="js/mango.js"></script>
<body>
</html>