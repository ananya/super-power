var CSSViewer_element

var CSSViewer_element_cssDefinition

var CSSViewer_container

var CSSViewer_current_element

// CSS Properties
var CSSViewer_pFont = new Array(
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'letter-spacing',
	'line-height',
	'text-decoration',
	'text-align',
	'text-indent',
	'text-transform',
	'vertical-align',
	'white-space',
	'word-spacing'
);

var CSSViewer_pColorBg = new Array(
	'background-attachment',
	'background-color',
	'background-image',
	'background-position',
	'background-repeat',
	'color'
);

var CSSViewer_pBox = new Array(
	'height',
	'width',
	'border',
	'border-top',
	'border-right',
	'border-bottom',
	'border-left',
	'margin',
	'padding',
	'max-height',
	'min-height',
	'max-width',
	'min-width'
);

var CSSViewer_pPositioning = new Array(
	'position',
	'top',
	'bottom',
	'right',
	'left',
	'float',
	'display',
	'clear',
	'z-index'
);

var CSSViewer_pList = new Array(
	'list-style-image',
	'list-style-type',
	'list-style-position'
);

var CSSViewer_pTable = new Array(
	'border-collapse',
	'border-spacing',
	'caption-side',
	'empty-cells',
	'table-layout'
);

var CSSViewer_pMisc = new Array(
	'overflow',
	'cursor',
	'visibility'
);

var CSSViewer_pEffect = new Array(
	'transform',
	'transition',
	'outline',
	'outline-offset',
	'box-sizing',
	'resize',
	'text-shadow',
	'text-overflow',
	'word-wrap',
	'box-shadow',
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-left-radius',
	'border-bottom-right-radius'
);

// CSS Property categories
var CSSViewer_categories = {
	'pFontText': CSSViewer_pFont,
	'pColorBg': CSSViewer_pColorBg,
	'pBox': CSSViewer_pBox,
	'pPositioning': CSSViewer_pPositioning,
	'pList': CSSViewer_pList,
	'pTable': CSSViewer_pTable,
	'pMisc': CSSViewer_pMisc,
	'pEffect': CSSViewer_pEffect
};

var CSSViewer_categoriesTitle = {
	'pFontText': 'Font & Text',
	'pColorBg': 'Color & Background',
	'pBox': 'Box',
	'pPositioning': 'Positioning',
	'pList': 'List',
	'pTable': 'Table',
	'pMisc': 'Miscellaneous',
	'pEffect': 'Effects'
};

// Table tagnames
var CSSViewer_tableTagNames = new Array(
	'TABLE',
	'CAPTION',
	'THEAD',
	'TBODY',
	'TFOOT',
	'COLGROUP',
	'COL',
	'TR',
	'TH',
	'TD'
);

var CSSViewer_listTagNames = new Array(
	'UL',
	'LI',
	'DD',
	'DT',
	'OL'
);

// Hexadecimal
var CSSViewer_hexa = new Array(
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F'
);

var changeLogObject = {}

/*
** Utils
*/

function getPathTo(element) {
	if (element.id !== '')
		return "id('" + element.id + "')";
	if (element === document.body)
		return element.tagName;

	var ix = 0;
	var siblings = element.parentNode.childNodes;
	for (var i = 0; i < siblings.length; i++) {
		var sibling = siblings[i];
		if (sibling === element)
			return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
		if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
			ix++;
	}
}

function GetCurrentDocument() {
	return window.document;
}

function IsInArray(array, name) {
	for (var i = 0; i < array.length; i++) {
		if (name == array[i])
			return true;
	}

	return false;
}

function DecToHex(nb) {
	var nbHexa = '';

	nbHexa += CSSViewer_hexa[Math.floor(nb / 16)];
	nb = nb % 16;
	nbHexa += CSSViewer_hexa[nb];

	return nbHexa;
}

function RGBToHex(str) {
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var hexValues = str.split(', ');
	var hexStr = '#';

	for (var i = 0; i < hexValues.length; i++) {
		hexStr += DecToHex(hexValues[i]);
	}

	if (hexStr == "#00000000") {
		hexStr = "#FFFFFF";
	}

	hexStr = '<span style="border: 1px solid #000000 !important;width: 8px !important;height: 8px !important;display: inline-block !important;background-color:' + hexStr + ' !important;"></span> ' + hexStr;

	return hexStr;
}

function GetFileName(str) {
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var path = str.split('/');

	return path[path.length - 1];
}

function RemoveExtraFloat(nb) {
	nb = nb.substr(0, nb.length - 2);

	return Math.round(nb) + 'px';
}

/*
* CSSFunc
*/
function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
		return index == 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
}
function GetCSSProperty(element, property) {
	return element.getPropertyValue(property);
}

function SetCSSProperty(element, property, felement) {
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.lastChild.value = element.getPropertyValue(property);
	li.lastChild.style.width = '70%'
	var lib = document.getElementById('CSSViewer_' + property);
	lib.lastChild.oninput = function (e) {
		var updatedInput = document.getElementById('CSSViewer_' + property);
		var k = camelize(property).replace("-", "");
		felement.style[k] = updatedInput.lastChild.value;
		var XPath = getPathTo(felement);
		changeLogObject[XPath] = felement.style;
	};
}

function SetCSSPropertyIf(element, property, condition, felement) {
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	if (condition) {
		li.lastChild.value = element.getPropertyValue(property);
		li.lastChild.style.width = '70%'
		// li.lastChild.keypress = ((val) => { element.style.property = val; console.log(val)})
		var lib = document.getElementById('CSSViewer_' + property);
		lib.lastChild.oninput = function (e) {
			var updatedInput = document.getElementById('CSSViewer_' + property);
			var k = camelize(property).replace("-", "");
			felement.style[k] = updatedInput.lastChild.value;
			var XPath = getPathTo(felement);
			changeLogObject[XPath] = felement.style;
		};
		lib.style.display = 'block';
		return 1;
	}
	else {
		li.style.display = 'none';
		return 0;
	}
}

function SetCSSPropertyValue(element, property, value, felement) {
	// console.log(felement);

	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.lastChild.value = element.getPropertyValue(property);
	li.lastChild.style.width = '70%'
	var lib = document.getElementById('CSSViewer_' + property);
	// console.log(lib)
	lib.lastChild.oninput = function (e) {
		var updatedInput = document.getElementById('CSSViewer_' + property);
		// console.log(updatedInput);

		var k = camelize(property).replace("-", "");
		felement.style[k] = updatedInput.lastChild.value;
		var XPath = getPathTo(felement);
		changeLogObject[XPath] = felement.style;
	};
	lib.style.display = 'block';
}


function SetCSSPropertyValueIf(element, property, value, condition, felement) {
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);
	li.lastChild.value = element.getPropertyValue(property);

	li.lastChild.style.width = '70%'
	if (condition) {
		var lib = document.getElementById('CSSViewer_' + property);
		lib.lastChild.oninput = function (e) {
			var updatedInput = document.getElementById('CSSViewer_' + property);
			var k = camelize(property).replace("-", "");
			felement.style[k] = updatedInput.lastChild.value;
			var XPath = getPathTo(felement);
			changeLogObject[XPath] = felement.style;
		};
		lib.style.display = 'block';

		return 1;
	}
	else {
		li.style.display = 'none';

		return 0;
	}
}

function HideCSSProperty(property) {
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.style.display = 'none';
}

function HideCSSCategory(category) {
	var document = GetCurrentDocument();
	var div = document.getElementById('CSSViewer_' + category);

	div.style.display = 'none';
}

function ShowCSSCategory(category) {
	var document = GetCurrentDocument();
	var div = document.getElementById('CSSViewer_' + category);

	div.style.display = 'block';
}

function UpdatefontText(element, felement) {

	// Font
	SetCSSProperty(element, 'font-family', felement);
	SetCSSProperty(element, 'font-size', felement);

	SetCSSPropertyIf(element, 'font-weight', GetCSSProperty(element, 'font-weight') != '400', felement);
	SetCSSPropertyIf(element, 'font-variant', GetCSSProperty(element, 'font-variant') != 'normal', felement);
	SetCSSPropertyIf(element, 'font-style', GetCSSProperty(element, 'font-style') != 'normal', felement);

	// Text
	SetCSSPropertyIf(element, 'letter-spacing', GetCSSProperty(element, 'letter-spacing') != 'normal', felement);
	SetCSSPropertyIf(element, 'line-height', GetCSSProperty(element, 'line-height') != 'normal', felement);
	SetCSSPropertyIf(element, 'text-decoration', GetCSSProperty(element, 'text-decoration') != 'none', felement);
	SetCSSPropertyIf(element, 'text-align', GetCSSProperty(element, 'text-align') != 'start', felement);
	SetCSSPropertyIf(element, 'text-indent', GetCSSProperty(element, 'text-indent') != '0px', felement);
	SetCSSPropertyIf(element, 'text-transform', GetCSSProperty(element, 'text-transform') != 'none', felement);
	SetCSSPropertyIf(element, 'vertical-align', GetCSSProperty(element, 'vertical-align') != 'baseline', felement);
	SetCSSPropertyIf(element, 'white-space', GetCSSProperty(element, 'white-space') != 'normal', felement);
	SetCSSPropertyIf(element, 'word-spacing', GetCSSProperty(element, 'word-spacing') != 'normal', felement);
}

function UpdateColorBg(element, felement) {
	// console.log(GetCSSProperty(element, 'color'))
	// Color
	SetCSSPropertyValue(element, 'color', RGBToHex(GetCSSProperty(element, 'color')), felement);

	// console.log(GetCSSProperty(element, 'background-color') )
	// Background
	SetCSSPropertyValueIf(element, 'background-color', RGBToHex(GetCSSProperty(element, 'background-color')), GetCSSProperty(element, 'background-color') != 'transparent', felement);
	SetCSSPropertyIf(element, 'background-attachment', GetCSSProperty(element, 'background-attachment') != 'scroll', felement);
	SetCSSPropertyValueIf(element, 'background-image', GetFileName(GetCSSProperty(element, 'background-image')), GetCSSProperty(element, 'background-image') != 'none', felement);
	SetCSSPropertyIf(element, 'background-position', GetCSSProperty(element, 'background-position') != '', felement);
	SetCSSPropertyIf(element, 'background-repeat', GetCSSProperty(element, 'background-repeat') != 'repeat', felement);
}

function UpdateBox(element, felement) {
	// Width/Height
	SetCSSPropertyIf(element, 'height', RemoveExtraFloat(GetCSSProperty(element, 'height')) != 'auto', felement);
	SetCSSPropertyIf(element, 'width', RemoveExtraFloat(GetCSSProperty(element, 'width')) != 'auto', felement);

	// Border
	var borderTop = RemoveExtraFloat(GetCSSProperty(element, 'border-top-width')) + ' ' + GetCSSProperty(element, 'border-top-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-top-color'));
	var borderBottom = RemoveExtraFloat(GetCSSProperty(element, 'border-bottom-width')) + ' ' + GetCSSProperty(element, 'border-bottom-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-bottom-color'));
	var borderRight = RemoveExtraFloat(GetCSSProperty(element, 'border-right-width')) + ' ' + GetCSSProperty(element, 'border-right-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-right-color'));
	var borderLeft = RemoveExtraFloat(GetCSSProperty(element, 'border-left-width')) + ' ' + GetCSSProperty(element, 'border-left-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-left-color'));

	if (borderTop == borderBottom && borderBottom == borderRight && borderRight == borderLeft && GetCSSProperty(element, 'border-top-style') != 'none') {
		SetCSSPropertyValue(element, 'border', borderTop, felement);

		HideCSSProperty('border-top');
		HideCSSProperty('border-bottom');
		HideCSSProperty('border-right');
		HideCSSProperty('border-left');
	}
	else {
		SetCSSPropertyValueIf(element, 'border-top', borderTop, GetCSSProperty(element, 'border-top-style') != 'none', felement);
		SetCSSPropertyValueIf(element, 'border-bottom', borderBottom, GetCSSProperty(element, 'border-bottom-style') != 'none', felement);
		SetCSSPropertyValueIf(element, 'border-right', borderRight, GetCSSProperty(element, 'border-right-style') != 'none', felement);
		SetCSSPropertyValueIf(element, 'border-left', borderLeft, GetCSSProperty(element, 'border-left-style') != 'none', felement);

		HideCSSProperty('border');
	}

	// Margin
	var marginTop = RemoveExtraFloat(GetCSSProperty(element, 'margin-top'));
	var marginBottom = RemoveExtraFloat(GetCSSProperty(element, 'margin-bottom'));
	var marginRight = RemoveExtraFloat(GetCSSProperty(element, 'margin-right'));
	var marginLeft = RemoveExtraFloat(GetCSSProperty(element, 'margin-left'));
	var margin = (marginTop == '0px' ? '0' : marginTop) + ' ' + (marginRight == '0px' ? '0' : marginRight) + ' ' + (marginBottom == '0px' ? '0' : marginBottom) + ' ' + (marginLeft == '0px' ? '0' : marginLeft);

	SetCSSPropertyValueIf(element, 'margin', margin, margin != '0 0 0 0', felement);

	// padding
	var paddingTop = RemoveExtraFloat(GetCSSProperty(element, 'padding-top'));
	var paddingBottom = RemoveExtraFloat(GetCSSProperty(element, 'padding-bottom'));
	var paddingRight = RemoveExtraFloat(GetCSSProperty(element, 'padding-right'));
	var paddingLeft = RemoveExtraFloat(GetCSSProperty(element, 'padding-left'));
	var padding = (paddingTop == '0px' ? '0' : paddingTop) + ' ' + (paddingRight == '0px' ? '0' : paddingRight) + ' ' + (paddingBottom == '0px' ? '0' : paddingBottom) + ' ' + (paddingLeft == '0px' ? '0' : paddingLeft);

	SetCSSPropertyValueIf(element, 'padding', padding, padding != '0 0 0 0', felement);

	// Max/Min Width/Height
	SetCSSPropertyIf(element, 'min-height', GetCSSProperty(element, 'min-height') != '0px', felement);
	SetCSSPropertyIf(element, 'max-height', GetCSSProperty(element, 'max-height') != 'none', felement);
	SetCSSPropertyIf(element, 'min-width', GetCSSProperty(element, 'min-width') != '0px', felement);
	SetCSSPropertyIf(element, 'max-width', GetCSSProperty(element, 'max-width') != 'none', felement);
}

function UpdatePositioning(element, felement) {
	SetCSSPropertyIf(element, 'position', GetCSSProperty(element, 'position') != 'static', felement);
	SetCSSPropertyIf(element, 'top', GetCSSProperty(element, 'top') != 'auto', felement);
	SetCSSPropertyIf(element, 'bottom', GetCSSProperty(element, 'bottom') != 'auto', felement);
	SetCSSPropertyIf(element, 'right', GetCSSProperty(element, 'right') != 'auto', felement);
	SetCSSPropertyIf(element, 'left', GetCSSProperty(element, 'left') != 'auto', felement);
	SetCSSPropertyIf(element, 'float', GetCSSProperty(element, 'float') != 'none', felement);

	SetCSSProperty(element, 'display', felement);

	SetCSSPropertyIf(element, 'clear', GetCSSProperty(element, 'clear') != 'none', felement);
	SetCSSPropertyIf(element, 'z-index', GetCSSProperty(element, 'z-index') != 'auto', felement);
}

function UpdateTable(element, tagName, felement) {
	if (IsInArray(CSSViewer_tableTagNames, tagName)) {
		var nbProperties = 0;

		nbProperties += SetCSSPropertyIf(element, 'border-collapse', GetCSSProperty(element, 'border-collapse') != 'separate', felement);
		nbProperties += SetCSSPropertyIf(element, 'border-spacing', GetCSSProperty(element, 'border-spacing') != '0px 0px', felement);
		nbProperties += SetCSSPropertyIf(element, 'caption-side', GetCSSProperty(element, 'caption-side') != 'top', felement);
		nbProperties += SetCSSPropertyIf(element, 'empty-cells', GetCSSProperty(element, 'empty-cells') != 'show', felement);
		nbProperties += SetCSSPropertyIf(element, 'table-layout', GetCSSProperty(element, 'table-layout') != 'auto', felement);

		if (nbProperties > 0)
			ShowCSSCategory('pTable');
		else
			HideCSSCategory('pTable');
	}
	else {
		HideCSSCategory('pTable');
	}
}

function UpdateList(element, tagName, felement) {
	if (IsInArray(CSSViewer_listTagNames, tagName)) {
		ShowCSSCategory('pList');

		var listStyleImage = GetCSSProperty(element, 'list-style-image');

		if (listStyleImage == 'none') {
			SetCSSProperty(element, 'list-style-type', felement);
			HideCSSProperty('list-style-image');
		}
		else {
			SetCSSPropertyValue(element, 'list-style-image', listStyleImage, felement);
			HideCSSProperty('list-style-type');
		}

		SetCSSProperty(element, 'list-style-position', felement);
	}
	else {
		HideCSSCategory('pList');
	}
}

function UpdateMisc(element, felement) {
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'overflow', GetCSSProperty(element, 'overflow') != 'visible', felement);
	nbProperties += SetCSSPropertyIf(element, 'cursor', GetCSSProperty(element, 'cursor') != 'auto', felement);
	nbProperties += SetCSSPropertyIf(element, 'visibility', GetCSSProperty(element, 'visibility') != 'visible', felement);

	if (nbProperties > 0)
		ShowCSSCategory('pMisc');
	else
		HideCSSCategory('pMisc');
}

function UpdateEffects(element, felement) {
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'transform', GetCSSProperty(element, 'transform'), felement);
	nbProperties += SetCSSPropertyIf(element, 'transition', GetCSSProperty(element, 'transition'), felement);
	nbProperties += SetCSSPropertyIf(element, 'outline', GetCSSProperty(element, 'outline'), felement);
	nbProperties += SetCSSPropertyIf(element, 'outline-offset', GetCSSProperty(element, 'outline-offset') != '0px', felement);
	nbProperties += SetCSSPropertyIf(element, 'box-sizing', GetCSSProperty(element, 'box-sizing') != 'content-box', felement);
	nbProperties += SetCSSPropertyIf(element, 'resize', GetCSSProperty(element, 'resize') != 'none', felement);

	nbProperties += SetCSSPropertyIf(element, 'text-shadow', GetCSSProperty(element, 'text-shadow') != 'none', felement);
	nbProperties += SetCSSPropertyIf(element, 'text-overflow', GetCSSProperty(element, 'text-overflow') != 'clip', felement);
	nbProperties += SetCSSPropertyIf(element, 'word-wrap', GetCSSProperty(element, 'word-wrap') != 'normal', felement);
	nbProperties += SetCSSPropertyIf(element, 'box-shadow', GetCSSProperty(element, 'box-shadow') != 'none', felement);

	nbProperties += SetCSSPropertyIf(element, 'border-top-left-radius', GetCSSProperty(element, 'border-top-left-radius') != '0px', felement);
	nbProperties += SetCSSPropertyIf(element, 'border-top-right-radius', GetCSSProperty(element, 'border-top-right-radius') != '0px', felement);
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-left-radius', GetCSSProperty(element, 'border-bottom-left-radius') != '0px', felement);
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-right-radius', GetCSSProperty(element, 'border-bottom-right-radius') != '0px', felement);

	if (nbProperties > 0)
		ShowCSSCategory('pEffect');
	else
		HideCSSCategory('pEffect');
}

/*
** Event Handlers
*/

function UpdateHtml(felement) {
	// console.log(felement)
	if(felement.innerHTML!='') {
		var document = GetCurrentDocument();
		var li = document.getElementById('spanHtmlId');
		li.value = felement.innerHTML;
		// console.log(li.innerHTML);
		
		li.style.width = '94%'
		
		// var lib = document.getElementById('');
		li.oninput = function (e) {
			var updatedInput = document.getElementById('spanHtmlId');
			felement.innerText = updatedInput.value;
			var XPath = getPathTo(felement);
			changeLogObject[XPath] = felement.innerHTML;
		};
	}
}

function CSSViewerMouseOver(e) {
	// Block
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if (!block) {
		return;
	}

	block.firstChild.innerHTML = '&lt;' + this.tagName + '&gt;' + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className);

	// Outline element
	if (this.tagName != 'body') {
		this.style.outline = '1px dashed #f00';
		CSSViewer_current_element = this;
	}

	// Updating CSS properties
	var element = document.defaultView.getComputedStyle(this, null);

	UpdatefontText(element, this);
	UpdateColorBg(element, this);
	UpdateBox(element, this);
	UpdatePositioning(element, this);
	UpdateTable(element, this.tagName, this);
	UpdateList(element, this.tagName, this);
	UpdateMisc(element, this);
	UpdateEffects(element, this);
	UpdateHtml(this);


	CSSViewer_element = this;

	cssViewerRemoveElement("cssViewerInsertMessage");

	e.stopPropagation();

	// generate simple css definition
	CSSViewer_element_cssDefinition = this.tagName.toLowerCase() + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className) + " {\n";

	CSSViewer_element_cssDefinition += "\t/* Font & Text */\n";
	for (var i = 0; i < CSSViewer_pFont.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pFont[i] + ': ' + element.getPropertyValue(CSSViewer_pFont[i]) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Color & Background */\n";
	for (var i = 0; i < CSSViewer_pColorBg.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pColorBg[i] + ': ' + element.getPropertyValue(CSSViewer_pColorBg[i]) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Box */\n";
	for (var i = 0; i < CSSViewer_pBox.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pBox[i] + ': ' + element.getPropertyValue(CSSViewer_pBox[i]) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Positioning */\n";
	for (var i = 0; i < CSSViewer_pPositioning.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pPositioning[i] + ': ' + element.getPropertyValue(CSSViewer_pPositioning[i]) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* List */\n";
	for (var i = 0; i < CSSViewer_pList.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pList[i] + ': ' + element.getPropertyValue(CSSViewer_pList[i]) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Table */\n";
	for (var i = 0; i < CSSViewer_pTable.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pTable[i] + ': ' + element.getPropertyValue(CSSViewer_pTable[i]) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Miscellaneous */\n";
	for (var i = 0; i < CSSViewer_pMisc.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pMisc[i] + ': ' + element.getPropertyValue(CSSViewer_pMisc[i]) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Effects */\n";
	for (var i = 0; i < CSSViewer_pEffect.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pEffect[i] + ': ' + element.getPropertyValue(CSSViewer_pEffect[i]) + ";\n";

	CSSViewer_element_cssDefinition += "}";
}

function CSSViewerMouseOverCommit(e) {
	// Block
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_commitblock');

	if (!block) {
		return;
	}

	CSSViewer_element = this;

	cssViewerRemoveElement("cssViewerInsertMessage");

	e.stopPropagation();
}


function CSSViewerMouseOut(e) {
	this.style.outline = '';

	e.stopPropagation();
}

function CSSViewerMouseMove(e) {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if (!block) {
		return;
	}

	block.style.display = 'block';

	var pageWidth = window.innerWidth;
	var pageHeight = window.innerHeight;
	var blockWidth = 332;
	var blockHeight = document.defaultView.getComputedStyle(block, null).getPropertyValue('height');

	blockHeight = blockHeight.substr(0, blockHeight.length - 2) * 1;

	if ((e.pageX + blockWidth) > pageWidth) {
		if ((e.pageX - blockWidth - 10) > 0)
			block.style.left = e.pageX - blockWidth - 40 + 'px';
		else
			block.style.left = 0 + 'px';
	}
	else
		block.style.left = (e.pageX + 20) + 'px';

	if ((e.pageY + blockHeight) > pageHeight) {
		if ((e.pageY - blockHeight - 10) > 0)
			block.style.top = e.pageY - blockHeight - 20 + 'px';
		else
			block.style.top = 0 + 'px';
	}
	else
		block.style.top = (e.pageY + 20) + 'px';

	// adapt block top to screen offset
	inView = CSSViewerIsElementInViewport(block);

	if (!inView)
		block.style.top = (window.pageYOffset + 100) + 'px';

	e.stopPropagation();
}

function CSSViewerMouseMoveCommit(e) {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_commitblock');

	if (!block) {
		return;
	}

	block.style.display = 'block';

	var pageWidth = window.innerWidth;
	var pageHeight = window.innerHeight;
	var blockWidth = 332;
	var blockHeight = document.defaultView.getComputedStyle(block, null).getPropertyValue('height');

	blockHeight = blockHeight.substr(0, blockHeight.length - 2) * 1;

	if ((e.pageX + blockWidth) > pageWidth) {
		if ((e.pageX - blockWidth - 10) > 0)
			block.style.left = e.pageX - blockWidth - 40 + 'px';
		else
			block.style.left = 0 + 'px';
	}
	else
		block.style.left = (e.pageX + 20) + 'px';

	if ((e.pageY + blockHeight) > pageHeight) {
		if ((e.pageY - blockHeight - 10) > 0)
			block.style.top = e.pageY - blockHeight - 20 + 'px';
		else
			block.style.top = 0 + 'px';
	}
	else
		block.style.top = (e.pageY + 20) + 'px';

	// adapt block top to screen offset
	inView = CSSViewerIsElementInViewport(block);

	if (!inView)
		block.style.top = (window.pageYOffset + 100) + 'px';

	e.stopPropagation();
}


// http://stackoverflow.com/a/7557433
function CSSViewerIsElementInViewport(el) {
	var rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}


var xmlHttp = new XMLHttpRequest();
function httpPost(string) {
	xmlHttp.open("POST", "https://calm-cliffs-91609.herokuapp.com/addCommit", true); // false for synchronous request
	xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlHttp.send(JSON.stringify({
		pageUrl: document.location.href,
		changeLog: JSON.stringify(changeLogObject),
		stringTBI: string
	}));
	return xmlHttp.responseText;
}

function fetchCommitList() {
	xmlHttp.open("POST", "https://calm-cliffs-91609.herokuapp.com/fetchCommits", true); // false for synchronous request
	xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlHttp.send(JSON.stringify({
		pageUrl: document.location.href,
	}));
	return xmlHttp.responseText;
}
function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function setCSS(name, commitList) {
	console.log(name, parseInt(name));
	
	var pathName = Object.entries(JSON.parse(commitList[parseInt(name)].commitByCommit.commit_log))[0][0];
	var pathstyle = Object.entries(JSON.parse(commitList[parseInt(name)].commitByCommit.commit_log))[0][1];	


	Object.keys(getElementByXpath(pathName).style).forEach(property => {
		getElementByXpath(pathName).style[property] = pathstyle[property];
	});
}

/*
* CSSViewer Class
*/
function CSSViewer() {
	// Create a block to display informations
	this.CreateBlock = function () {
		var document = GetCurrentDocument();
		var commitMessageInput = document.createElement('input');
		commitMessageInput.id = "inputMessage"
		var commitButton = document.createElement('button');
		commitButton.id= "butt"
		commitButton.textContent = "Make Commit"
		// commitButton.innerText = '<img class = "cimg" src="https://static.thenounproject.com/png/446229-200.png" height="30px" width="30px" />'
		commitButton.onclick = () => {
			var string = document.getElementById('inputMessage').value;
			if (changeLogObject !== {}) {
				httpPost(string);
			}
			changeLogObject = {};
			cssViewerInsertMessage("Commit Saved!")

		};
		commitButton.style.position = "fixed";
		commitButton.style.bottom = 0;
		commitButton.style.right = 0;
		commitButton.style.zIndex = 099999;
		commitMessageInput.style.position = "fixed";
		commitMessageInput.style.bottom = 0;
		commitMessageInput.style.left = 0;
		commitMessageInput.style.zIndex = 099999;
		commitMessageInput.style.color = "#000000";
		commitMessageInput.style.backgroundColor = "white !important";

		document.lastChild.appendChild(commitButton);
		document.lastChild.appendChild(commitMessageInput);
		var block;

		if (document) {
			// Create a div block
			block = document.createElement('div');
			block.id = 'CSSViewer_block';
			// block.appendChild(commitblock);
			// Insert a title for CSS selector
			var header = document.createElement('h1');

			header.appendChild(document.createTextNode(''));
			block.appendChild(header);

			// Insert all properties
			var center = document.createElement('div');

			center.id = 'CSSViewer_center';

			spanHtml = document.createElement('input')
			spanHtml.id = 'spanHtmlId'
			block.appendChild(spanHtml)

			for (var cat in CSSViewer_categories) {
				var div = document.createElement('div');

				div.id = 'CSSViewer_' + cat;
				div.className = 'CSSViewer_category';

				// var h2 = document.createElement('h2');

				// h2.appendChild(document.createTextNode(CSSViewer_categoriesTitle[cat]));

				var ul = document.createElement('ul');
				var properties = CSSViewer_categories[cat];

				for (var i = 0; i < properties.length; i++) {
					var li = document.createElement('li');

					li.id = 'CSSViewer_' + properties[i];

					var spanName = document.createElement('span');

					spanName.className = 'CSSViewer_property';

					var spanValue = document.createElement('input');
					if (properties[i] === 'color' || properties[i] === 'background-color') {
						spanValue.type = 'color';
						spanValue.id = 'colorid';
					}

					spanName.appendChild(document.createTextNode(properties[i]));
					li.appendChild(spanName);
					li.appendChild(spanValue);
					ul.appendChild(li);
				}

				// div.appendChild(h2);
				div.appendChild(ul);
				center.appendChild(div);
			}

			block.appendChild(center);

			// Insert a footer
			var footer = document.createElement('div');

			footer.id = 'CSSViewer_footer';

			//
			footer.appendChild(document.createTextNode(' Keys: [f] Un/Freeze. [c] Export Css. [Esc] Close [k]See Commits.'));
			block.appendChild(footer);
		}

		cssViewerInsertMessage("Hover any element you want to inspect in the page!");

		return block;
	}

	this.createCommitBlock = function(){
		var document = GetCurrentDocument();
		var commitblock;
		if(document){
			commitblock = document.createElement('div');
			commitblock.id = 'CSSViewer_commitblock';

			fetchCommitList();
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == XMLHttpRequest.DONE) {

					var commitList = JSON.parse(xmlHttp.response).data.url_commit_log;		
					var header  = document.createElement('h1')
					header.id = "hey";
					header.appendChild(document.createTextNode('Commit History'));
					commitblock.appendChild(header);
					for (let index = 0; index < commitList.length; index++) {

						if(Object.entries(JSON.parse(commitList[index].commitByCommit.commit_log))[0] != null){
							
							
							var commitListContainer = document.createElement('div');
							commitListContainer.id = "commitListContainer";

							var pathName = Object.entries(JSON.parse(commitList[index].commitByCommit.commit_log))[0][0];
							var pathstyle = Object.entries(JSON.parse(commitList[index].commitByCommit.commit_log))[0][1];						

							var ApplyCommitButton = document.createElement('button');
							ApplyCommitButton.id = "apply_button";
							ApplyCommitButton.name = JSON.stringify(index);
							ApplyCommitButton.innerText = commitList[index].commitByCommit.commitMessage;

							ApplyCommitButton.onclick = () => {

								setCSS(index, commitList)

							}

							commitListContainer.appendChild(ApplyCommitButton);

							commitblock.appendChild(commitListContainer);
						}

					}
				}
				
			}

			
		}
		return commitblock;
	}
	// Get all elements within the given element
	this.GetAllElements = function (element) {
		var elements = new Array();

		if (element && element.hasChildNodes()) {
			elements.push(element);

			var childs = element.childNodes;

			for (var i = 0; i < childs.length; i++) {
				if (childs[i].hasChildNodes()) {
					elements = elements.concat(this.GetAllElements(childs[i]));
				}
				else if (childs[i].nodeType == 1) {
					elements.push(childs[i]);
				}
			}
		}

		return elements;
	}

	// Add bool for knowing all elements having event listeners or not
	this.haveEventListeners = false;
	this.haveEventListenersCommit = false;
	

	// Add event listeners for all elements in the current document
	this.AddEventListeners = function () {
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener("mouseover", CSSViewerMouseOver, false);
			elements[i].addEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].addEventListener("mousemove", CSSViewerMouseMove, false);
		}
		this.haveEventListeners = true;
	}

	this.AddEventListenersCommit = function () {
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener("mouseover", CSSViewerMouseOverCommit, false);
			elements[i].addEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].addEventListener("mousemove", CSSViewerMouseMoveCommit, false);
		}
		this.haveEventListenersCommit = true;
	}
	
	// Remove event listeners for all elements in the current document
	this.RemoveEventListeners = function () {
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++) {
			elements[i].removeEventListener("mouseover", CSSViewerMouseOver, false);
			elements[i].removeEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].removeEventListener("mousemove", CSSViewerMouseMove, false);
		}
		this.haveEventListeners = false;
	}
	this.RemoveEventListenersCommit = function () {
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++) {
			elements[i].removeEventListener("mouseover", CSSViewerMouseOverCommit, false);
			elements[i].removeEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].removeEventListener("mousemove", CSSViewerMouseMoveCommit, false);
		}
		this.haveEventListenersCommit = false;
	}
	// Set the title of the block
	this.SetTitle = function () { }

	// Add a stylesheet to the current document
	this.AddCSS = function (cssFile) {
		var document = GetCurrentDocument();
		var link = document.createElement("link");

		link.setAttribute("href", cssFile);
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");

		var heads = document.getElementsByTagName("head");

		if (heads.length > 0)
			heads[0].appendChild(link);
		else
			document.documentElement.appendChild(link);
	}

	this.RemoveCSS = function (cssFile) {
		var document = GetCurrentDocument();
		var links = document.getElementsByTagName('link');

		for (var i = 0; i < links.length; i++) {
			if (links[i].rel == "stylesheet" && links[i].href == cssFile) {
				var heads = document.getElementsByTagName("head");

				if (heads.length > 0) {
					heads[0].removeChild(links[i]);
				}

				return;
			}
		}
	}
}

/*
* Check if CSSViewer is enabled
*/
CSSViewer.prototype.IsEnabled = function () {
	var document = GetCurrentDocument();

	if (document.getElementById('CSSViewer_block')) {
		return true;
	}

	return false;
}

CSSViewer.prototype.IsEnabledCommit = function () {
	var document = GetCurrentDocument();

	if (document.getElementById('CSSViewer_commitblock')) {
		return true;
	}

	return false;
}
/*
* Enable CSSViewer
*/
CSSViewer.prototype.Enable = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if (!block) {
		block = this.CreateBlock();
		document.body.appendChild(block);
		this.AddEventListeners();

		return true;
	}

	return false;
}

CSSViewer.prototype.EnableCommit = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_commitblock');

	if (!block) {
		block = this.createCommitBlock();
		document.body.appendChild(block);
		this.AddEventListenersCommit();
		return true;
	}

	return false;
}

/*
* Disable CSSViewer
*/
CSSViewer.prototype.Disable = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if (block) {
		document.body.removeChild(block);
		this.RemoveEventListeners();

		return true;
	}

	return false;
}

CSSViewer.prototype.DisableCommit = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_commitblock');

	if (block) {
		document.body.removeChild(block);
		this.RemoveEventListenersCommit();

		return true;
	}

	return false;
}

/*
* Freeze CSSViewer
*/
CSSViewer.prototype.Freeze = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');
	if (block && this.haveEventListeners) {
		this.RemoveEventListeners();

		return true;
	}

	return false;
}
CSSViewer.prototype.FreezeCommit = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_commitblock');
	if (block && this.haveEventListenersCommit) {
		this.RemoveEventListenersCommit();

		return true;
	}

	return false;
}

/*
* Unfreeze CSSViewer
*/
CSSViewer.prototype.Unfreeze = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');
	if (block && !this.haveEventListeners) {
		// Remove the red outline
		CSSViewer_current_element.style.outline = '';
		this.AddEventListeners();

		return true;
	}

	return false;
}

CSSViewer.prototype.UnfreezeCommit = function () {
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_commitblock');
	if (block && !this.haveEventListenersCommit) {
		// Remove the red outline
		CSSViewer_current_element.style.outline = '';
		this.AddEventListenersCommit();

		return true;
	}

	return false;
}

/*
* Display the notification message
*/
function cssViewerInsertMessage(msg) {
	var oNewP = document.createElement("p");
	var oText = document.createTextNode(msg);

	oNewP.appendChild(oText);
	oNewP.id = 'cssViewerInsertMessage';
	oNewP.style.backgroundColor = '#b40000';
	oNewP.style.color = '#ffffff';
	oNewP.style.position = "absolute";
	oNewP.style.top = '10px';
	oNewP.style.left = '10px';
	oNewP.style.zIndex = '100';
	oNewP.style.padding = '3px';

	// https://github.com/miled/cssviewer/issues/5
	// https://github.com/miled/cssviewer/issues/6
	// var beforeMe = document.getElementsByTagName("body");
	// document.body.insertBefore( oNewP, beforeMe[0] );

	// https://github.com/zchee/cssviewer/commit/dad107d27e94aabeb6e11b935ad28c4ff251f895
	document.body.appendChild(oNewP);
}

/*
* Removes and element from the dom, used to remove the notification message
*/
function cssViewerRemoveElement(divid) {
	var n = document.getElementById(divid);

	if (n) {
		document.body.removeChild(n);
	}
}

/*
* Copy current element css to chrome console
*/
function cssViewerCopyCssToConsole(type) {
	if ('el' == type) return console.log(CSSViewer_element);
	if ('id' == type) return console.log(CSSViewer_element.id);
	if ('tagName' == type) return console.log(CSSViewer_element.tagName);
	if ('className' == type) return console.log(CSSViewer_element.className);
	if ('style' == type) return console.log(CSSViewer_element.style);
	if ('cssText' == type) return console.log(document.defaultView.getComputedStyle(CSSViewer_element, null).cssText);
	if ('getComputedStyle' == type) return console.log(document.defaultView.getComputedStyle(CSSViewer_element, null));
	if ('simpleCssDefinition' == type) return console.log(CSSViewer_element_cssDefinition);
}

/*
*  Close css viewer on clicking 'esc' key
*  Freeze css viewer on clicking 'f' key
*/
function CssViewerKeyMap(e) {

	// ESC: Close the css viewer if the cssViewer is enabled.
	if (e.keyCode === 27) {
		// Remove the red outline
		CSSViewer_current_element.style.outline = '';
		cssViewer.Disable();
	}

	if (e.altKey || e.ctrlKey)
		return;

	// f: Freeze or Unfreeze the css viewer if the cssViewer is enabled
	if (e.keyCode === 70) {
		if (cssViewer.haveEventListeners) {
			if(cssViewer.IsEnabled()) cssViewer.Freeze();
		}
		else if(!cssViewer.haveEventListeners){
			cssViewer.Unfreeze();
		}

		if(cssViewer.haveEventListenersCommit) {
			cssViewer.FreezeCommit();
		}
		else if(!cssViewer.haveEventListenersCommit) cssViewer.UnfreezeCommit();
	}

	// c: Show code css for selected element. 
	// window.prompt should suffice for now.
	if (e.keyCode === 67) {
		window.prompt("Simple Css Definition :\n\nYou may copy the code below then hit escape to continue.", CSSViewer_element_cssDefinition);
	}
	//prompt commits
	if(e.keyCode === 75){
		if(cssViewer.IsEnabled()){
			console.log('ifnot the ensable wala')
			cssViewer.Disable();
			cssViewer.EnableCommit();
		}
		else {
			console.log('ifnot the disable wala')
			cssViewer.DisableCommit();
			cssViewer.Enable();
		}
	}
}


/*
* CSSViewer entry-point
*/
cssViewer = new CSSViewer();

if (cssViewer.IsEnabled()) {
	cssViewer.Disable();
}
else {
	cssViewer.Enable();
}

// Set event handler for the CssViewer 
document.onkeydown = CssViewerKeyMap;


