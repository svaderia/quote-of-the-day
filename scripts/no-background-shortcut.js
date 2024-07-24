// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: chess-board;

/* -----------------------------------------------

Script      : no-background-shortcut.js
Author      : svaderia.github.io
Version     : 1.0.0
Description :
	Adaption of supermon's amazing no-background module.
		This is supposed to be run as a shortcut script. 
		You would save the image into 'cache/nobgs/temp.jpeg' from your shortcut.
		The script will take this image, and generate all the slices as per the module
		written by supermon.
		This script assumes that the temp.jpeg is cropped with device's wallpaper ratios.

Reference : https://github.com/supermamon/scriptable-no-background
*/

const USES_ICLOUD = usesiCloud()
const fm = FileManagerAdaptive()
const CACHE_FOLDER = 'cache/nobg'
const cachePath = fm.joinPath(fm.documentsDirectory(), CACHE_FOLDER);
const wPath = fm.joinPath(fm.documentsDirectory(), 'cache/nobgs/temp.jpeg')
const device_id = `${Device.model()}_${Device.name()}`.replace(/[^a-zA-Z0-9\-\_]/, '').toLowerCase()


//------------------------------------------------
const widgetPositions = {
  "small": [
    "Top Left", "Top Right",
    "Middle Left", "Middle Right",
    "Bottom Left", "Bottom Right"
  ],
  "medium": ["Top", "Middle", "Bottom"],
  "large": ["Top", "Bottom"]
}
//------------------------------------------------
const phoneSizes = {
  "2796": {
    "models": ["14 Pro Max"],
    "small": { "w": 510, "h": 510 },
    "medium": { "w": 1092, "h": 510 },
    "large": { "w": 1092, "h": 1146 },
    "left": 99,
    "right": 681,
    "top": 282,
    "middle": 918,
    "bottom": 1554
  },

  "2556": {
    "models": ["14 Pro"],
    "small": { "w": 474, "h": 474 },
    "medium": { "w": 1014, "h": 474 },
    "large": { "w": 1014, "h": 1062 },
    "left": 82,
    "right": 622,
    "top": 270,
    "middle": 858,
    "bottom": 1446
  },

  "2778": {
    "models": ["12 Pro Max", "13 Pro Max", "14 Plus"],
    "small": { "w": 510, "h": 510 },
    "medium": { "w": 1092, "h": 510 },
    "large": { "w": 1092, "h": 1146 },
    "left": 96,
    "right": 678,
    "top": 246,
    "middle": 882,
    "bottom": 1518
  },

  "2532": {
    "models": ["12", "12 Pro", "13", "14"],
    "small": { "w": 474, "h": 474 },
    "medium": { "w": 1014, "h": 474 },
    "large": { "w": 1014, "h": 1062 },
    "left": 78,
    "right": 618,
    "top": 231,
    "middle": 819,
    "bottom": 1407
  },

  "2688": {
    "models": ["Xs Max", "11 Pro Max"],
    "small": { "w": 507, "h": 507 },
    "medium": { "w": 1080, "h": 507 },
    "large": { "w": 1080, "h": 1137 },
    "left": 81,
    "right": 654,
    "top": 228,
    "middle": 858,
    "bottom": 1488
  },

  "1792": {
    "models": ["11", "Xr"],
    "small": { "w": 338, "h": 338 },
    "medium": { "w": 720, "h": 338 },
    "large": { "w": 720, "h": 758 },
    "left": 54,
    "right": 436,
    "top": 160,
    "middle": 580,
    "bottom": 1000
  },

  "2436": {
    "models": ["X", "Xs", "11 Pro"],
    "small": { "w": 465, "h": 465 },
    "medium": { "w": 987, "h": 465 },
    "large": { "w": 987, "h": 1035 },
    "left": 69,
    "right": 591,
    "top": 213,
    "middle": 783,
    "bottom": 1353
  },

  "2436_mini": {
    "models": ["12 Mini"],
    "small": { "w": 465, "h": 465 },
    "medium": { "w": 987, "h": 465 },
    "large": { "w": 987, "h": 1035 },
    "left": 69,
    "right": 591,
    "top": 231,
    "middle": 801,
    "bottom": 1371
  },

  "2208": {
    "models": ["6+", "6s+", "7+", "8+"],
    "small": { "w": 471, "h": 471 },
    "medium": { "w": 1044, "h": 471 },
    "large": { "w": 1044, "h": 1071 },
    "left": 99,
    "right": 672,
    "top": 114,
    "middle": 696,
    "bottom": 1278
  },

  "1334": {
    "models": ["6", "6s", "7", "8"],
    "small": { "w": 296, "h": 296 },
    "medium": { "w": 642, "h": 296 },
    "large": { "w": 642, "h": 648 },
    "left": 54,
    "right": 400,
    "top": 60,
    "middle": 412,
    "bottom": 764
  },

  "1136": {
    "models": ["5", "5s", "5c", "SE"],
    "small": { "w": 282, "h": 282 },
    "medium": { "w": 584, "h": 282 },
    "large": { "w": 584, "h": 622 },
    "left": 30,
    "right": 332,
    "top": 59,
    "middle": 399,
    "bottom": 399
  }
}
//------------------------------------------------
function cropImage(img, rect) {
  let draw = new DrawContext()
  draw.size = new Size(rect.width, rect.height)
  draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y))
  return draw.getImage()
}
//------------------------------------------------
async function isUsingDarkAppearance() {
  return !(Color.dynamic(Color.white(), Color.black()).red)
}
//------------------------------------------------
function usesiCloud() {
  return module.filename
    .includes('Documents/iCloud~')
}
//------------------------------------------------
function FileManagerAdaptive() {
  return module.filename
    .includes('Documents/iCloud~')
    ? FileManager.iCloud()
    : FileManager.local()
}

// if running self run config
const module_name = module.filename.match(/[^\/]+$/)[0].replace('.js', '')
if (module_name == Script.name()) {
  
  let appearance = (await isUsingDarkAppearance()) ? 'dark' : 'light'
  let altAppearance = appearance == 'dark' ? 'light' : 'dark'

  if (!fm.fileExists(cachePath)) {
    fm.createDirectory(cachePath, true)
  }

  // Get screenshot and determine phone size.
    
  let wallpaper = fm.readImage(wPath)
  let height = wallpaper.size.height
  let suffix = "";
  
	if(wallpaper == null){
 		Script.setShortcutOutput("image doesn't exist at " + wPath + "?")
    return;
	}

  let phone = phoneSizes[height + suffix]
  if (!phone) {
    message = "It looks like the image you saved doesn't have correct parameters, please make sure the height is "
  	Script.setShortcutOutput(message + height)
		return;
  }

  const families = ['small', 'medium', 'large']

  // generate crop rects for all sizes
  for (var i = 0; i < families.length; i++) {
    const widgetSize = families[i]

    let crops = widgetPositions[widgetSize].map(posName => {

      let position = posName.toLowerCase().replace(' ', '-')

      let crop = { pos: position, w: "", h: "", x: "", y: "" }
      crop.w = phone[widgetSize].w
      crop.h = phone[widgetSize].h
      crop.x = phone.left

      let pos = position.split('-')

      crop.y = phone[pos[0]]

      if (widgetSize == 'large' && pos[0] == 'bottom') {
        crop.y = phone['middle']
      }

      if (pos.length > 1) {
        crop.x = phone[pos[1]]
      }

      return crop
    })

    for (var c = 0; c < crops.length; c++) {
      const crop = crops[c]
      const imgCrop = cropImage(wallpaper, new Rect(crop.x, crop.y, crop.w, crop.h))

      const imgName = `${device_id}-${appearance}-${widgetSize}-${crop.pos}.jpg`
      const imgPath = fm.joinPath(cachePath, imgName)

      if (fm.fileExists(imgPath)) {
        // sometimes it wouldn't overwrite. 
        // so better delete the file first
        if (USES_ICLOUD) await fm.downloadFileFromiCloud(imgPath)
        try { fm.remove(imgPath) } catch (e) { }
      }
      fm.writeImage(imgPath, imgCrop)
    }
  }
} 

Script.complete()
