(function(window, undefined) {
  'use strict';

  var Mango = (function() {
    // DOM elements
    var editorInputElement = document.getElementById('editorInput'),
        editorOutputElement = document.getElementById('editorOutput'),
        editorOutputTextElement = document.getElementById('editorOutputText'),
        caretElement = document.getElementById('caret'),
        hiddenSpanElement = document.getElementById('hiddenSpan'),
        lineNumbersPanelElement = document.getElementById('lineNumbersPanel'),
        currentLineHighlightElement = document.getElementById('currentLineHighlight'),

    // intervals
        _positionCaretInterval,

    // other
        numOfLines = 1,
        prevNumOfLines = 1,
        topbarHeight = 35,
        currentLineHeight = getComputedStyle(currentLineHighlightElement).height.slice(0, -2),
        cursorWidth = getComputedStyle(caretElement).width.slice(0, -2),

    _getPosInCurrLine = function() {
      var caretPos = editorInputElement.selectionStart,
          textAreaValue = editorInputElement.value,
          offset = 0;
      for (var nextLine = caretPos; nextLine < textAreaValue.length && textAreaValue[nextLine] != '\n'; ++nextLine);
      if (nextLine - caretPos === 0) {
        offset = -1;
      }
      for (var currPos = caretPos + offset; currPos >= 0 && textAreaValue[currPos] != '\n'; --currPos);
      return caretPos - currPos - 1;
    },

    _getCurrLine = function() {
      var caretPos = editorInputElement.selectionStart,
          textAreaValue = editorInputElement.value;
      for (var currPos = caretPos, currLine = 0, pass = 0; currPos >= 0; --currPos, pass++) {
        if (textAreaValue[currPos] == '\n') {
          if (currPos < textAreaValue.length && pass > 0) {
            currLine++;
          }
        }
      }

      return currLine;
    },

    /**
     * Calculates the x and y coordinates of the caret.
     * x is calculated by multiplying the width of 1 char by the number of characters in the caret is.
     * y is calculated by multiplying the height of 1 line by the number of lines down the caret is.
     */
    _getCaretPos = function() {
      _getCaretPos.y = editorInputElement.offsetTop - editorInputElement.scrollTop + (_getCurrLine() * getComputedStyle(editorInputElement)['line-height'].slice(0, -2));
      if (_getCaretPos.y > window.innerHeight - currentLineHeight) {
        _getCaretPos.y = window.innerHeight - currentLineHeight;
      }
      
      _getCaretPos.x = editorInputElement.offsetLeft + (_getPosInCurrLine() * hiddenSpanElement.offsetWidth);
      if (_getCaretPos.x > window.innerWidth - cursorWidth) {
        _getCaretPos.x = window.innerWidth - cursorWidth;
      }
      
      return {
        x: _getCaretPos.x,
        y: _getCaretPos.y
      }
    },

    _updateLineNumbersPanel = function() {
      numOfLines = utils.stringOccurrences(editorInputElement.value, '\n');

      if (prevNumOfLines !== numOfLines) {
        for (var i = 1, s = ''; i < numOfLines; i++) {
          s += (i + '<br/>');
        }

        s += numOfLines;
        lineNumbersPanelElement.innerHTML = s;
        prevNumOfLines = numOfLines;
      }
    },

    _positionCaret = function() {
      if (document.activeElement === editorInput) {
        var caretPos = _getCaretPos();
        caretElement.style.left = caretPos.x + 'px';
        caretElement.style.top = caretPos.y + 'px';
      }
    },

    _updateCurrentLineHighlight = function() {
      //currentLineHighlight.style.top = (_getCurrLine() * getComputedStyle(editorInputElement)['line-height'].slice(0, -2) + topbarHeight - editorInputElement.scrollTop) + 'px';
      currentLineHighlight.style.top = _getCaretPos().y + 'px';
    },

    // -----------------------------------
    // Event Handlers
    // -----------------------------------

    handleEditorInputChange = function(evt) {
      editorOutputTextElement.innerHTML = '';
      editorOutputTextElement.appendChild(document.createTextNode(editorInputElement.value));
      //editorOutputTextElement.innerHTML = editorInputElement.value.replace(/\n/g,'<br/>');
      //editorOutputTextElement.innerHTML = editorInputElement.value.split('\n').join('<br/>');
      //hljs.highlightBlock(editorOutputTextElement);
      if (editorOutputTextElement.innerHTML.slice(-1) === '\n') {
        //editorOutputTextElement.innerHTML += ' ';
      } else {
        //editorOutputTextElement.innerHTML = editorOutputTextElement.innerHTML.replace('&nbsp;','');
      }
      _positionCaret();
      _updateCurrentLineHighlight();

      // update line numbers
      _updateLineNumbersPanel();
    },

    handleEditorInputClick = function() {
      _positionCaret();
      _updateCurrentLineHighlight();
      utils.addClass(caretElement, 'blink');
    },

    handleEditorInputScroll = function(evt) {
      editorOutputElement.scrollTop = editorInputElement.scrollTop;
      editorOutputTextElement.scrollLeft = editorInputElement.scrollLeft;
      lineNumbersPanelElement.scrollTop = editorInputElement.scrollTop;
    },

    handleKeydown = function(evt) {
      utils.removeClass(caretElement, 'blink');
      _positionCaret();
      _updateCurrentLineHighlight();

      // TAB
      if (evt.which === 9) {
        evt.preventDefault();
        var selectionEnd = evt.srcElement.selectionEnd + 2;
        editorInputElement.value = utils.stringSplice(editorInputElement.value, evt.srcElement.selectionEnd, 0, '  ');
        handleEditorInputChange();
        editorInput.setSelectionRange(selectionEnd, selectionEnd);
      }
    },

    handleKeyup = function(evt) {
      utils.addClass(caretElement, 'blink');
      _positionCaret();
      _updateCurrentLineHighlight();
    },

    utils = {
      stringSplice: function(str, index, remove, insert) {
        return (str.slice(0,index) + insert + str.slice(index));
      },

      stringOccurrences: function(str, sub) {
        for (var i = str.indexOf(sub), count = 1; i != -1; i = str.indexOf(sub, i+1), count++);
        return count;
      },

      addClass: function(element, clazz) {
        var classes = element.className;
        if (classes.indexOf(clazz) === -1) {
          element.className += clazz;
        }
      },

      removeClass: function(element, clazz) {
        var classes = element.className;
        if (classes.indexOf(clazz) > -1) {
          element.className = classes.split(clazz).join('');
        }
      }
    };

    return {
      init: function() {
        Mango.initEventing();
      },

      initEventing: function() {
        editorInputElement.addEventListener('input', handleEditorInputChange);
        editorInputElement.addEventListener('keydown', handleKeydown);
        editorInputElement.addEventListener('keyup', handleKeyup);
        editorInputElement.addEventListener('click', handleEditorInputClick);
        editorInputElement.addEventListener('scroll', handleEditorInputScroll);
      }
    };

  })(Mango = {});

  // on ready
  document.addEventListener('DOMContentLoaded', Mango.init, false);
  window.addEventListener('load', Mango.init, false);

})(window);