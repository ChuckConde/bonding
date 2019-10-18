// New copy task for font files
module.exports = {
  copyMobiscrollCss: {
    src: ['{{ROOT}}/node_modules/@mobiscroll/angular/dist/css/*'],
    dest: '{{WWW}}/lib/mobiscroll/css/'
  },
  copyFontAwesome: {
    src: ['{{ROOT}}/node_modules/font-awesome/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copySimpleLineIcons: {
    src: ['{{ROOT}}/node_modules/simple-line-icons/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  }
};
