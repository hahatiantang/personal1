/**
 * canvas 绘制 高质量 图片
 * Created by 陈明峰 on 09/12/2016.
 */
module.exports = {
  //赋值原图大小
  downScaleImage(img, scale, canvas, context, imageMetaData) {
    canvas.width = imageMetaData.image_width;
    canvas.height = imageMetaData.image_height;
    context.drawImage(img, 0, 0);
    return this.downScaleCanvas(canvas, scale);
  },

//缩放到显示区域大小
  downScaleCanvas(cv, scale) {
    if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
    let sqScale = scale * scale; // square scale = area of source pixel within target
    let sw = cv.width; // source image width
    let sh = cv.height; // source image height
    let tw = Math.floor(sw * scale); // target image width
    let th = Math.floor(sh * scale); // target image height
    let sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    let tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    let tX = 0, tY = 0; // rounded tx, ty
    let w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    let crossX = false; // does scaled px cross its current px right border ?
    let crossY = false; // does scaled px cross its current px bottom border ?
    let sBuffer = cv.getContext('2d').
    getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    let tBuffer = new Float32Array(4 * sw * sh); // target buffer Float32 rgb
    let sR = 0, sG = 0,  sB = 0; // source's current point r,g,b
    // untested !
    let sA = 0;  //source alpha

    for (sy = 0; sy < sh; sy++) {
      ty = sy * scale; // y src position within target
      tY = 0 | ty;     // rounded : target pixel's y
      yIndex = 4 * tY * tw;  // line index within target array
      crossY = (tY != (0 | ty + scale));
      if (crossY) { // if pixel is crossing botton target pixel
        wy = (tY + 1 - ty); // weight of point within target pixel
        nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
      }
      for (sx = 0; sx < sw; sx++, sIndex += 4) {
        tx = sx * scale; // x src position within target
        tX = 0 |  tx;    // rounded : target pixel's x
        tIndex = yIndex + tX * 4; // target pixel index within target array
        crossX = (tX != (0 | tx + scale));
        if (crossX) { // if pixel is crossing target pixel's right
          wx = (tX + 1 - tx); // weight of point within target pixel
          nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
        }
        sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
        sG = sBuffer[sIndex + 1];
        sB = sBuffer[sIndex + 2];
        sA = sBuffer[sIndex + 3];

        if (!crossX && !crossY) { // pixel does not cross
          // just add components weighted by squared scale.
          tBuffer[tIndex    ] += sR * sqScale;
          tBuffer[tIndex + 1] += sG * sqScale;
          tBuffer[tIndex + 2] += sB * sqScale;
          tBuffer[tIndex + 3] += sA * sqScale;
        } else if (crossX && !crossY) { // cross on X only
          w = wx * scale;
          // add weighted component for current px
          tBuffer[tIndex    ] += sR * w;
          tBuffer[tIndex + 1] += sG * w;
          tBuffer[tIndex + 2] += sB * w;
          tBuffer[tIndex + 3] += sA * w;
          // add weighted component for next (tX+1) px
          nw = nwx * scale
          tBuffer[tIndex + 4] += sR * nw; // not 3
          tBuffer[tIndex + 5] += sG * nw; // not 4
          tBuffer[tIndex + 6] += sB * nw; // not 5
          tBuffer[tIndex + 7] += sA * nw; // not 6
        } else if (crossY && !crossX) { // cross on Y only
          w = wy * scale;
          // add weighted component for current px
          tBuffer[tIndex    ] += sR * w;
          tBuffer[tIndex + 1] += sG * w;
          tBuffer[tIndex + 2] += sB * w;
          tBuffer[tIndex + 3] += sA * w;
          // add weighted component for next (tY+1) px
          nw = nwy * scale
          tBuffer[tIndex + 4 * tw    ] += sR * nw; // *4, not 3
          tBuffer[tIndex + 4 * tw + 1] += sG * nw; // *4, not 3
          tBuffer[tIndex + 4 * tw + 2] += sB * nw; // *4, not 3
          tBuffer[tIndex + 4 * tw + 3] += sA * nw; // *4, not 3
        } else { // crosses both x and y : four target points involved
          // add weighted component for current px
          w = wx * wy;
          tBuffer[tIndex    ] += sR * w;
          tBuffer[tIndex + 1] += sG * w;
          tBuffer[tIndex + 2] += sB * w;
          tBuffer[tIndex + 3] += sA * w;
          // for tX + 1; tY px
          nw = nwx * wy;
          tBuffer[tIndex + 4] += sR * nw; // same for x
          tBuffer[tIndex + 5] += sG * nw;
          tBuffer[tIndex + 6] += sB * nw;
          tBuffer[tIndex + 7] += sA * nw;
          // for tX ; tY + 1 px
          nw = wx * nwy;
          tBuffer[tIndex + 4 * tw    ] += sR * nw; // same for mul
          tBuffer[tIndex + 4 * tw + 1] += sG * nw;
          tBuffer[tIndex + 4 * tw + 2] += sB * nw;
          tBuffer[tIndex + 4 * tw + 3] += sA * nw;
          // for tX + 1 ; tY +1 px
          nw = nwx * nwy;
          tBuffer[tIndex + 4 * tw + 4] += sR * nw; // same for both x and y
          tBuffer[tIndex + 4 * tw + 5] += sG * nw;
          tBuffer[tIndex + 4 * tw + 6] += sB * nw;
          tBuffer[tIndex + 4 * tw + 7] += sA * nw;
        }
      } // end for sx
    } // end for sy

    // create result canvas
    let resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    let resCtx = resCV.getContext('2d');
    let imgRes = resCtx.getImageData(0, 0, tw, th);
    let tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    let pxIndex = 0; //
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 4, tIndex += 4, pxIndex++) {
      tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
      tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
      tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
      tByteBuffer[tIndex + 3] = Math.ceil(tBuffer[sIndex + 3]);
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV;
  }
};