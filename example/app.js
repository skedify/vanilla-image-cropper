(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ImageCropper = require('./imagecrop.min.js');

var dimensions = null;
var is_active = false;
var img_c = null;

var onUpdateHandler = function (dim) {
  dimensions = dim;
};

var onCropHandler = function() {
  var img = new Image();
  img.src = img_c.crop('image/jpeg', 1);
  img.width = dimensions.w;
  img.height = dimensions.h;
  var target = document.querySelector('.preview');
  while(target.firstChild) {
    target.removeChild(target.firstChild)
  }
  target.appendChild(img);
};

var onCreateHandler = function() {
  if(is_active) { return; }

  new ImageCropper('.test-imagecrop', 'img.jpg', {
    update: onUpdateHandler
  });
  destroy_btn.style.display = 'initial';
  create_btn.style.display = 'none';

  is_active = true;
};

var onDestroyHandler = function() {
  if(!is_active) { return; }

  img_c.destroy();
  destroy_btn.style.display = 'none';
  create_btn.style.display = 'initial';

  is_active = false;
};

var crop_btn = document.querySelector('.crop-button');
crop_btn.addEventListener('click', onCropHandler);

var create_btn = document.querySelector('.create-button');
create_btn.addEventListener('click', onCreateHandler);
create_btn.style.display = 'none';

var destroy_btn = document.querySelector('.destroy-button');
destroy_btn.addEventListener('click', onDestroyHandler);

img_c = new ImageCropper('.test-imagecrop', 'img.jpg', {
  update: onUpdateHandler,
  min_crop_width: 100,
  min_crop_height: 150,
  fixed_size: true,
  create_cb: function(dim) {
    console.log('created - ', dim);
  },
  destroy_cb: function() {
    console.log('destroy');
  }
});
is_active = true;
},{"./imagecrop.min.js":2}],2:[function(require,module,exports){
module.exports=function(){function e(e){s&&this.destroy(),s=document.querySelector(e),s.className+=" imgc ".indexOf(" "+x.cn+" ")>-1?"":" imgc"}function t(e){var t=s.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top;return{x:0>n?0:n>t.width?t.width:n,y:0>i?0:i>t.height?t.height:i}}function n(){var e=parseInt(s.style.width),t=parseInt(s.style.height);y.x<0&&(y.x=0,y.x2=y.w),y.y<0&&(y.y=0,y.y2=y.h),y.x2>e&&(y.x2=e,y.x=y.x2-y.w),y.y2>t&&(y.y2=t,y.y=y.y2-y.h),y.w=y.x2-y.x,y.h=y.y2-y.y,d.style.top=y.y+"px",d.style.left=y.x+"px",d.style.right=~~(e-y.x2)+"px",d.style.bottom=~~(t-y.y2)+"px",u.setAttribute("d","M 0 0 v"+t+"h"+e+"v"+-t+"H-0zM"+y.x+" "+y.y+"h"+y.w+"v"+y.h+"h-"+y.w+"V-"+y.h+"z"),x.up&&x.up(y)}function i(e){e=t(e),y.x=e.x-.5*y.w,y.y=e.y-.5*y.h,y.x2=e.x+.5*y.w,y.y2=e.y+.5*y.h,n()}function o(e){document.addEventListener("mousemove",h),document.addEventListener("mouseup",c),i(e)}function c(e){document.removeEventListener("mouseup",c),document.removeEventListener("mousemove",h)}function h(e){i(e)}function m(e,i,o){function c(e){e.stopPropagation(),document.addEventListener("mouseup",m),document.addEventListener("mousemove",h)}function h(e){e.stopPropagation(),e=t(e),o(e),n()}function m(e){e.stopPropagation(),document.removeEventListener("mouseup",m),document.removeEventListener("mousemove",h)}var r=document.createElement("span");return r.className="imgc-handles-el-"+e+"-"+i,r.addEventListener("mousedown",c),r}function r(t,n,i){n&&t&&(i=i||{},Object.keys(f).forEach(function(e){x[f[e][0]]=i[e]||f[e][1]}),x.mcw>80&&(y.x2=y.w=x.mcw),x.mch>80&&(y.y2=y.h=x.mch),x.fs&&(x.mcw>80||x.mch>80)&&(y.x2=y.y2=y.w=y.h=x.mcw>x.mch?x.mcw:x.mch),e(t),w=new Image,w.addEventListener("load",function(e){this.create()}.bind(this)),w.src=n)}var s,d,u,a=!1,y={},x={},w=null,p={w:1,h:1},f={update:["up",!1],create_cb:["cr",!1],destroy_cb:["de",!1],min_crop_width:["mcw",32],min_crop_height:["mch",32],max_width:["mw",500],max_height:["mh",500],fixed_size:["fs",!1]},v=[function(e){var t=y.x;v[7](e),x.fs?y.y+y.x-t<0?(y.x=t-y.y,y.y=0):y.y+=y.x-t:v[4](e)},function(e){var t=y.x2;v[5](e),x.fs?y.y-y.x2+t<0?(y.x2=t+y.y,y.y=0):y.y-=y.x2-t:v[4](e)},function(e){var t=y.x2;if(v[5](e),x.fs){var n=s.getBoundingClientRect();y.y2+y.x2-t>n.height?(y.x2=t+(n.height-y.y2),y.y2=n.height):y.y2+=y.x2-t}else v[6](e)},function(e){var t=y.x;if(v[7](e),x.fs){var n=s.getBoundingClientRect();y.y2+(t-y.x)>n.height?(y.x=t-(n.height-y.y2),y.y2=n.height):y.y2-=y.x-t}else v[6](e)},function(e){y.y=y.y2-e.y<x.mch?y.y2-x.mch:e.y},function(e){y.x2=e.x-y.x<x.mcw?y.x+x.mcw:e.x},function(e){y.y2=e.y-y.y<x.mch?y.y+x.mch:e.y},function(e){y.x=y.x2-e.x<x.mcw?y.x2-x.mcw:e.x}];return r.prototype.create=function(t){if(!a){s||e(t);var i=w.width,c=w.height;i>x.mw&&(c=~~(x.mw*c/i),i=x.mw),c>x.mh&&(i=~~(x.mh*i/c),c=x.mh),p={w:w.naturalWidth/i,h:w.naturalHeight/c},s.style.width=i+"px",s.style.height=c+"px",s.addEventListener("DOMNodeRemovedFromDocument",this.destroy),s.appendChild(w);var h=document.createElementNS("http://www.w3.org/2000/svg","svg");h.setAttribute("height",c),h.setAttribute("width",i),s.appendChild(h),u=document.createElementNS("http://www.w3.org/2000/svg","path"),h.appendChild(u),d=document.createElement("div"),d.className="imgc-handles",s.appendChild(d);for(var r=0;r<(x.fs?4:8);r++)d.appendChild(new m(x.fs?0:~~(r/4),r%4,v[r]));s.addEventListener("mousedown",o),a=!0,y={x:0,y:0,x2:0,y2:0,w:0,h:0},i===c?y.x2=y.y2=i:i>c?(y.x2=c,y.y2=x.fs?c:c-(i-c)):c>i&&(y.x2=x.fs?i:i-(c-i),y.y2=i),n(),x.cr&&x.cr({w:i,h:c})}},r.prototype.destroy=function(){if(a){if(s){for(s.removeEventListener("DOMNodeRemovedFromDocument",this.destroy),s.removeEventListener("mousedown",o);s.firstChild;)s.removeChild(s.firstChild);s=w=d=u=null}a=!1,x.de&&x.de()}},r.prototype.crop=function(e,t){(!e||"image/jpeg"!==e&&"image/png"!==e)&&(e="image/jpeg"),(!t||0>t||t>1)&&(t=1);var n=document.createElement("canvas");n.setAttribute("width",y.w),n.setAttribute("height",y.h);var i=n.getContext("2d");return i.drawImage(w,p.w*y.x,p.h*y.y,p.w*y.w,p.h*y.h,0,0,y.w,y.h),n.toDataURL(e,t)},r}();
},{}]},{},[1]);
