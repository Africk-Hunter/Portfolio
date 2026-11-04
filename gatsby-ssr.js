const saved = require('./src/data/background.json');

// Paint the saved page color in the static HTML so it does not flash the stylesheet's color first.
exports.onRenderBody = ({ setHtmlAttributes }) => {
  if (saved.bg) setHtmlAttributes({ style: `background:${saved.bg};--t-page-bg:${saved.bg}` });
};
