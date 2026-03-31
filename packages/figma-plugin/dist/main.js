"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/handlers/creation.ts
  function getParent(parentId) {
    if (parentId) {
      const node = figma.getNodeById(parentId);
      if (!node) throw new Error(`Parent node not found: ${parentId}`);
      if (!("children" in node)) throw new Error(`Node ${parentId} cannot have children`);
      return node;
    }
    return figma.currentPage;
  }
  function applyFills(node, fills) {
    if (!fills || fills.length === 0) return;
    const paintFills = fills.map((f) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      switch (f.type) {
        case "SOLID":
          return {
            type: "SOLID",
            color: { r: (_b = (_a = f.color) == null ? void 0 : _a.r) != null ? _b : 0, g: (_d = (_c = f.color) == null ? void 0 : _c.g) != null ? _d : 0, b: (_f = (_e = f.color) == null ? void 0 : _e.b) != null ? _f : 0 },
            opacity: (_g = f.opacity) != null ? _g : 1,
            visible: (_h = f.visible) != null ? _h : true
          };
        case "GRADIENT_LINEAR":
        case "GRADIENT_RADIAL":
        case "GRADIENT_ANGULAR":
        case "GRADIENT_DIAMOND":
          return {
            type: f.type,
            gradientStops: ((_i = f.gradientStops) != null ? _i : []).map((s) => {
              var _a2;
              return {
                position: s.position,
                color: { r: s.color.r, g: s.color.g, b: s.color.b, a: (_a2 = s.color.a) != null ? _a2 : 1 }
              };
            }),
            gradientTransform: (_j = f.gradientTransform) != null ? _j : [[1, 0, 0], [0, 1, 0]],
            opacity: (_k = f.opacity) != null ? _k : 1,
            visible: (_l = f.visible) != null ? _l : true
          };
        default:
          return { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
      }
    });
    node.fills = paintFills;
  }
  function nodeResult(node) {
    return {
      nodeId: node.id,
      name: node.name,
      type: node.type
    };
  }
  function handleCreation(command, params) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U;
      const p = params;
      const parent = command === "create_section" ? figma.currentPage : getParent(p.parentId);
      switch (command) {
        case "create_frame": {
          const frame = figma.createFrame();
          frame.name = (_a = p.name) != null ? _a : "Frame";
          frame.resize((_b = p.width) != null ? _b : 100, (_c = p.height) != null ? _c : 100);
          frame.x = (_d = p.x) != null ? _d : 0;
          frame.y = (_e = p.y) != null ? _e : 0;
          applyFills(frame, p.fills);
          if (p.autoLayout) {
            const al = p.autoLayout;
            frame.layoutMode = al.direction;
            if (al.spacing !== void 0) frame.itemSpacing = al.spacing;
            if (al.paddingTop !== void 0) frame.paddingTop = al.paddingTop;
            if (al.paddingRight !== void 0) frame.paddingRight = al.paddingRight;
            if (al.paddingBottom !== void 0) frame.paddingBottom = al.paddingBottom;
            if (al.paddingLeft !== void 0) frame.paddingLeft = al.paddingLeft;
            if (al.primaryAxisAlignItems) frame.primaryAxisAlignItems = al.primaryAxisAlignItems;
            if (al.counterAxisAlignItems) frame.counterAxisAlignItems = al.counterAxisAlignItems;
            if (al.primaryAxisSizingMode) frame.primaryAxisSizingMode = al.primaryAxisSizingMode;
            if (al.counterAxisSizingMode) frame.counterAxisSizingMode = al.counterAxisSizingMode;
            if (al.layoutWrap) frame.layoutWrap = al.layoutWrap;
          }
          parent.appendChild(frame);
          return nodeResult(frame);
        }
        case "create_component": {
          const comp = figma.createComponent();
          comp.name = (_f = p.name) != null ? _f : "Component";
          comp.resize((_g = p.width) != null ? _g : 100, (_h = p.height) != null ? _h : 100);
          comp.x = (_i = p.x) != null ? _i : 0;
          comp.y = (_j = p.y) != null ? _j : 0;
          applyFills(comp, p.fills);
          parent.appendChild(comp);
          return nodeResult(comp);
        }
        case "create_section": {
          const section = figma.createSection();
          section.name = (_k = p.name) != null ? _k : "Section";
          section.x = (_l = p.x) != null ? _l : 0;
          section.y = (_m = p.y) != null ? _m : 0;
          if (p.width && p.height) section.resizeWithoutConstraints(p.width, p.height);
          if (p.fills) {
            applyFills(section, p.fills);
          }
          return nodeResult(section);
        }
        case "add_rectangle": {
          const rect = figma.createRectangle();
          rect.name = (_n = p.name) != null ? _n : "Rectangle";
          rect.resize((_o = p.width) != null ? _o : 100, (_p = p.height) != null ? _p : 100);
          rect.x = (_q = p.x) != null ? _q : 0;
          rect.y = (_r = p.y) != null ? _r : 0;
          if (p.cornerRadius !== void 0) {
            rect.cornerRadius = p.cornerRadius;
          }
          applyFills(rect, p.fills);
          parent.appendChild(rect);
          return nodeResult(rect);
        }
        case "add_ellipse": {
          const ellipse = figma.createEllipse();
          ellipse.name = (_s = p.name) != null ? _s : "Ellipse";
          ellipse.resize((_t = p.width) != null ? _t : 100, (_u = p.height) != null ? _u : 100);
          ellipse.x = (_v = p.x) != null ? _v : 0;
          ellipse.y = (_w = p.y) != null ? _w : 0;
          applyFills(ellipse, p.fills);
          parent.appendChild(ellipse);
          return nodeResult(ellipse);
        }
        case "add_text": {
          const text = figma.createText();
          const family = (_x = p.fontFamily) != null ? _x : "Inter";
          const style = (_y = p.fontWeight) != null ? _y : "Regular";
          yield figma.loadFontAsync({ family, style });
          text.fontName = { family, style };
          text.characters = (_z = p.content) != null ? _z : "";
          text.fontSize = (_A = p.fontSize) != null ? _A : 16;
          text.name = (_D = (_C = p.name) != null ? _C : (_B = p.content) == null ? void 0 : _B.substring(0, 20)) != null ? _D : "Text";
          text.x = (_E = p.x) != null ? _E : 0;
          text.y = (_F = p.y) != null ? _F : 0;
          if (p.width) {
            text.resize(p.width, text.height);
            text.textAutoResize = "HEIGHT";
          }
          applyFills(text, p.fills);
          parent.appendChild(text);
          return nodeResult(text);
        }
        case "add_shape": {
          let shape;
          if (p.shapeType === "LINE") {
            const line = figma.createLine();
            line.resize((_G = p.width) != null ? _G : 100, 0);
            line.x = (_H = p.x) != null ? _H : 0;
            line.y = (_I = p.y) != null ? _I : 0;
            line.name = (_J = p.name) != null ? _J : "Line";
            parent.appendChild(line);
            shape = line;
          } else if (p.shapeType === "STAR") {
            const star = figma.createStar();
            star.name = (_K = p.name) != null ? _K : "Star";
            star.resize((_L = p.width) != null ? _L : 100, (_M = p.height) != null ? _M : 100);
            star.x = (_N = p.x) != null ? _N : 0;
            star.y = (_O = p.y) != null ? _O : 0;
            if (p.pointCount) star.pointCount = p.pointCount;
            applyFills(star, p.fills);
            parent.appendChild(star);
            shape = star;
          } else {
            const polygon = figma.createPolygon();
            polygon.name = (_P = p.name) != null ? _P : "Polygon";
            polygon.resize((_Q = p.width) != null ? _Q : 100, (_R = p.height) != null ? _R : 100);
            polygon.x = (_S = p.x) != null ? _S : 0;
            polygon.y = (_T = p.y) != null ? _T : 0;
            if (p.pointCount) polygon.pointCount = p.pointCount;
            applyFills(polygon, p.fills);
            parent.appendChild(polygon);
            shape = polygon;
          }
          return nodeResult(shape);
        }
        case "clone_node": {
          const source = figma.getNodeById(p.nodeId);
          if (!source) throw new Error(`Node not found: ${p.nodeId}`);
          const clone = source.clone();
          if (p.x !== void 0) clone.x = p.x;
          else clone.x += 20;
          if (p.y !== void 0) clone.y = p.y;
          else clone.y += 20;
          if (p.parentId) {
            const newParent = getParent(p.parentId);
            newParent.appendChild(clone);
          }
          return nodeResult(clone);
        }
        case "set_image_fill": {
          const node = figma.getNodeById(p.nodeId);
          if (!node) throw new Error(`Node not found: ${p.nodeId}`);
          if (!("fills" in node)) throw new Error(`Node ${p.nodeId} does not support fills`);
          const image = yield figma.createImageAsync(p.imageUrl);
          node.fills = [{
            type: "IMAGE",
            imageHash: image.hash,
            scaleMode: (_U = p.scaleMode) != null ? _U : "FILL"
          }];
          return { success: true, nodeId: p.nodeId, imageHash: image.hash };
        }
        default:
          throw new Error(`Unknown creation command: ${command}`);
      }
    });
  }
  var init_creation = __esm({
    "src/handlers/creation.ts"() {
      "use strict";
    }
  });

  // src/handlers/styling.ts
  function handleStyling(command, params) {
    return __async(this, null, function* () {
      var _a, _b;
      const p = params;
      if (command === "list_styles") {
        return handleListStyles(p);
      }
      if (command === "apply_style") {
        return handleApplyStyle(p);
      }
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      const scene = node;
      if (p.fills && "fills" in scene) {
        const geo = scene;
        geo.fills = p.fills.map((f) => {
          var _a2, _b2, _c;
          return {
            type: (_a2 = f.type) != null ? _a2 : "SOLID",
            color: f.color ? { r: f.color.r, g: f.color.g, b: f.color.b } : { r: 0, g: 0, b: 0 },
            opacity: (_b2 = f.opacity) != null ? _b2 : 1,
            visible: (_c = f.visible) != null ? _c : true
          };
        });
      }
      if (p.strokes && "strokes" in scene) {
        const geo = scene;
        geo.strokes = p.strokes.map((s) => {
          var _a2;
          return {
            type: "SOLID",
            color: { r: s.color.r, g: s.color.g, b: s.color.b },
            opacity: (_a2 = s.opacity) != null ? _a2 : 1
          };
        });
      }
      if (p.strokeWeight !== void 0 && "strokeWeight" in scene) {
        scene.strokeWeight = p.strokeWeight;
      }
      if (p.opacity !== void 0) {
        scene.opacity = p.opacity;
      }
      if (p.cornerRadius !== void 0 && "cornerRadius" in scene) {
        scene.cornerRadius = p.cornerRadius;
      }
      if (scene.type === "TEXT") {
        const text = scene;
        const family = (_a = p.fontFamily) != null ? _a : text.fontName.family;
        const style = (_b = p.fontWeight) != null ? _b : text.fontName.style;
        yield figma.loadFontAsync({ family, style });
        text.fontName = { family, style };
        if (p.fontSize !== void 0) text.fontSize = p.fontSize;
        if (p.letterSpacing !== void 0) text.letterSpacing = { value: p.letterSpacing, unit: "PIXELS" };
        if (p.lineHeight !== void 0) text.lineHeight = { value: p.lineHeight, unit: "PIXELS" };
        if (p.textAlignHorizontal) text.textAlignHorizontal = p.textAlignHorizontal;
        if (p.textAlignVertical) text.textAlignVertical = p.textAlignVertical;
      }
      if (p.effects && "effects" in scene) {
        scene.effects = p.effects.map((e) => {
          var _a2, _b2, _c, _d, _e;
          return {
            type: e.type,
            visible: (_a2 = e.visible) != null ? _a2 : true,
            radius: (_b2 = e.radius) != null ? _b2 : 0,
            color: e.color ? { r: e.color.r, g: e.color.g, b: e.color.b, a: (_c = e.color.a) != null ? _c : 1 } : void 0,
            offset: (_d = e.offset) != null ? _d : { x: 0, y: 0 },
            spread: (_e = e.spread) != null ? _e : 0
          };
        });
      }
      return { success: true, nodeId: p.nodeId };
    });
  }
  function handleListStyles(p) {
    const styles = [];
    if (!p.styleType || p.styleType === "PAINT") {
      for (const s of figma.getLocalPaintStyles()) {
        styles.push({ id: s.id, name: s.name, type: "PAINT", description: s.description, key: s.key });
      }
    }
    if (!p.styleType || p.styleType === "TEXT") {
      for (const s of figma.getLocalTextStyles()) {
        styles.push({ id: s.id, name: s.name, type: "TEXT", description: s.description, key: s.key });
      }
    }
    if (!p.styleType || p.styleType === "EFFECT") {
      for (const s of figma.getLocalEffectStyles()) {
        styles.push({ id: s.id, name: s.name, type: "EFFECT", description: s.description, key: s.key });
      }
    }
    if (!p.styleType || p.styleType === "GRID") {
      for (const s of figma.getLocalGridStyles()) {
        styles.push({ id: s.id, name: s.name, type: "GRID", description: s.description, key: s.key });
      }
    }
    return { styles };
  }
  function handleApplyStyle(p) {
    var _a;
    const node = figma.getNodeById(p.nodeId);
    if (!node) throw new Error(`Node not found: ${p.nodeId}`);
    const style = figma.getStyleById(p.styleId);
    if (!style) throw new Error(`Style not found: ${p.styleId}`);
    const scene = node;
    const styleType = style.type;
    if (styleType === "PAINT") {
      const prop = (_a = p.property) != null ? _a : "fill";
      if (prop === "fill" && "fillStyleId" in scene) {
        scene.fillStyleId = p.styleId;
      } else if (prop === "stroke" && "strokeStyleId" in scene) {
        scene.strokeStyleId = p.styleId;
      } else {
        throw new Error(`Cannot apply paint style as "${prop}" on this node`);
      }
    } else if (styleType === "TEXT") {
      if (scene.type !== "TEXT") throw new Error("Text styles can only be applied to text nodes");
      scene.textStyleId = p.styleId;
    } else if (styleType === "EFFECT") {
      if (!("effectStyleId" in scene)) throw new Error("This node does not support effect styles");
      scene.effectStyleId = p.styleId;
    } else if (styleType === "GRID") {
      if (!("gridStyleId" in scene)) throw new Error("This node does not support grid styles");
      scene.gridStyleId = p.styleId;
    } else {
      throw new Error(`Unsupported style type: ${styleType}`);
    }
    return { success: true, nodeId: p.nodeId, styleId: p.styleId, styleType };
  }
  var init_styling = __esm({
    "src/handlers/styling.ts"() {
      "use strict";
    }
  });

  // src/handlers/layout.ts
  function handleLayout(params) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e;
      const p = params;
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      if (node.type !== "FRAME" && node.type !== "COMPONENT") {
        throw new Error(`Auto-layout can only be applied to frames or components, got ${node.type}`);
      }
      const frame = node;
      frame.layoutMode = p.direction;
      frame.itemSpacing = (_a = p.spacing) != null ? _a : 0;
      frame.paddingTop = (_b = p.paddingTop) != null ? _b : 0;
      frame.paddingRight = (_c = p.paddingRight) != null ? _c : 0;
      frame.paddingBottom = (_d = p.paddingBottom) != null ? _d : 0;
      frame.paddingLeft = (_e = p.paddingLeft) != null ? _e : 0;
      if (p.primaryAxisAlignItems) frame.primaryAxisAlignItems = p.primaryAxisAlignItems;
      if (p.counterAxisAlignItems) frame.counterAxisAlignItems = p.counterAxisAlignItems;
      if (p.primaryAxisSizingMode) frame.primaryAxisSizingMode = p.primaryAxisSizingMode;
      if (p.counterAxisSizingMode) frame.counterAxisSizingMode = p.counterAxisSizingMode;
      if (p.layoutWrap) frame.layoutWrap = p.layoutWrap;
      if (p.counterAxisSpacing !== void 0) frame.counterAxisSpacing = p.counterAxisSpacing;
      if (p.counterAxisAlignContent) frame.counterAxisAlignContent = p.counterAxisAlignContent;
      if (p.minWidth !== void 0) frame.minWidth = p.minWidth;
      if (p.maxWidth !== void 0) frame.maxWidth = p.maxWidth;
      if (p.minHeight !== void 0) frame.minHeight = p.minHeight;
      if (p.maxHeight !== void 0) frame.maxHeight = p.maxHeight;
      return { success: true, nodeId: p.nodeId, layoutMode: frame.layoutMode };
    });
  }
  var init_layout = __esm({
    "src/handlers/layout.ts"() {
      "use strict";
    }
  });

  // src/handlers/reading.ts
  function serializeNode(node, depth) {
    const result = {
      id: node.id,
      name: node.name,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      visible: node.visible,
      locked: node.locked,
      opacity: node.opacity,
      rotation: node.rotation
    };
    if ("blendMode" in node) {
      result.blendMode = node.blendMode;
    }
    if ("constraints" in node) {
      result.constraints = node.constraints;
    }
    if ("fills" in node && Array.isArray(node.fills)) {
      result.fills = node.fills.map((f) => {
        if (f.type === "SOLID") {
          return { type: "SOLID", color: f.color, opacity: f.opacity };
        }
        if (f.type === "IMAGE") {
          return { type: "IMAGE", imageHash: f.imageHash, scaleMode: f.scaleMode };
        }
        if (f.type.startsWith("GRADIENT")) {
          return {
            type: f.type,
            gradientStops: f.gradientStops,
            opacity: f.opacity
          };
        }
        return { type: f.type };
      });
    }
    if ("strokes" in node && Array.isArray(node.strokes)) {
      result.strokes = node.strokes.map((s) => {
        if (s.type === "SOLID") {
          return { type: "SOLID", color: s.color, opacity: s.opacity };
        }
        return { type: s.type };
      });
    }
    if (node.type === "TEXT") {
      const text = node;
      result.characters = text.characters;
      result.fontSize = typeof text.fontSize === "number" ? text.fontSize : void 0;
      result.fontName = text.fontName !== figma.mixed ? text.fontName : void 0;
    }
    if ("layoutMode" in node) {
      const frame = node;
      result.layoutMode = frame.layoutMode;
      if (frame.layoutMode !== "NONE") {
        result.itemSpacing = frame.itemSpacing;
        result.paddingTop = frame.paddingTop;
        result.paddingRight = frame.paddingRight;
        result.paddingBottom = frame.paddingBottom;
        result.paddingLeft = frame.paddingLeft;
      }
    }
    if ("layoutAlign" in node) result.layoutAlign = node.layoutAlign;
    if ("layoutGrow" in node) result.layoutGrow = node.layoutGrow;
    if ("layoutSizingHorizontal" in node) result.layoutSizingHorizontal = node.layoutSizingHorizontal;
    if ("layoutSizingVertical" in node) result.layoutSizingVertical = node.layoutSizingVertical;
    if ("layoutPositioning" in node) result.layoutPositioning = node.layoutPositioning;
    if (node.type === "INSTANCE") {
      const mainComponent = node.mainComponent;
      if (mainComponent) result.componentId = mainComponent.id;
    }
    if ("cornerRadius" in node) {
      const cr = node.cornerRadius;
      if (cr !== figma.mixed) result.cornerRadius = cr;
    }
    if ("children" in node && depth > 1) {
      result.children = node.children.map(
        (child) => serializeNode(child, depth - 1)
      );
    }
    return result;
  }
  function handleReading(command, params) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      const p = params;
      switch (command) {
        case "read_current_page": {
          const depth = (_a = p.depth) != null ? _a : 3;
          const page = figma.currentPage;
          return {
            pageId: page.id,
            pageName: page.name,
            children: page.children.map((child) => serializeNode(child, depth))
          };
        }
        case "get_node_by_id": {
          const node = figma.getNodeById(p.nodeId);
          if (!node) throw new Error(`Node not found: ${p.nodeId}`);
          if (!("x" in node)) throw new Error(`Node ${p.nodeId} is not a scene node`);
          const depth = p.includeChildren ? (_b = p.depth) != null ? _b : 2 : 1;
          return serializeNode(node, depth);
        }
        case "get_selection": {
          const depth = (_c = p.depth) != null ? _c : 2;
          const selection = figma.currentPage.selection;
          return {
            count: selection.length,
            nodes: selection.map((node) => serializeNode(node, depth))
          };
        }
        default:
          throw new Error(`Unknown reading command: ${command}`);
      }
    });
  }
  var init_reading = __esm({
    "src/handlers/reading.ts"() {
      "use strict";
    }
  });

  // src/handlers/mutation.ts
  function handleMutation(command, params) {
    return __async(this, null, function* () {
      var _a, _b;
      const p = params;
      switch (command) {
        case "edit_node": {
          const node = figma.getNodeById(p.nodeId);
          if (!node) throw new Error(`Node not found: ${p.nodeId}`);
          const scene = node;
          if (p.name !== void 0) scene.name = p.name;
          if (p.x !== void 0) scene.x = p.x;
          if (p.y !== void 0) scene.y = p.y;
          if (p.visible !== void 0) scene.visible = p.visible;
          if (p.locked !== void 0) scene.locked = p.locked;
          if (p.rotation !== void 0) scene.rotation = p.rotation;
          if (p.width !== void 0 || p.height !== void 0) {
            const w = (_a = p.width) != null ? _a : scene.width;
            const h = (_b = p.height) != null ? _b : scene.height;
            if ("resize" in scene) {
              scene.resize(w, h);
            }
          }
          if (p.characters !== void 0 && scene.type === "TEXT") {
            const text = scene;
            const fontName = text.fontName;
            yield figma.loadFontAsync(fontName);
            text.characters = p.characters;
          }
          if (p.blendMode !== void 0 && "blendMode" in scene) {
            scene.blendMode = p.blendMode;
          }
          if (p.constraints !== void 0 && "constraints" in scene) {
            scene.constraints = p.constraints;
          }
          if (p.layoutAlign !== void 0) scene.layoutAlign = p.layoutAlign;
          if (p.layoutGrow !== void 0) scene.layoutGrow = p.layoutGrow;
          if (p.layoutSizingHorizontal !== void 0) scene.layoutSizingHorizontal = p.layoutSizingHorizontal;
          if (p.layoutSizingVertical !== void 0) scene.layoutSizingVertical = p.layoutSizingVertical;
          if (p.layoutPositioning !== void 0) scene.layoutPositioning = p.layoutPositioning;
          return { success: true, nodeId: p.nodeId };
        }
        case "delete_node": {
          const node = figma.getNodeById(p.nodeId);
          if (!node) throw new Error(`Node not found: ${p.nodeId}`);
          node.remove();
          return { success: true, deleted: p.nodeId };
        }
        default:
          throw new Error(`Unknown mutation command: ${command}`);
      }
    });
  }
  var init_mutation = __esm({
    "src/handlers/mutation.ts"() {
      "use strict";
    }
  });

  // src/handlers/organization.ts
  function handleOrganization(command, params) {
    return __async(this, null, function* () {
      var _a, _b;
      const p = params;
      switch (command) {
        case "group_nodes": {
          const nodes = [];
          for (const id of p.nodeIds) {
            const node = figma.getNodeById(id);
            if (!node) throw new Error(`Node not found: ${id}`);
            nodes.push(node);
          }
          if (nodes.length === 0) throw new Error("No nodes to group");
          const group = figma.group(nodes, nodes[0].parent);
          group.name = (_a = p.name) != null ? _a : "Group";
          return { nodeId: group.id, name: group.name };
        }
        case "flatten_node": {
          const node = figma.getNodeById(p.nodeId);
          if (!node) throw new Error(`Node not found: ${p.nodeId}`);
          const flat = figma.flatten([node]);
          return { nodeId: flat.id, name: flat.name };
        }
        case "create_page": {
          const page = figma.createPage();
          page.name = (_b = p.name) != null ? _b : "New Page";
          return { pageId: page.id, name: page.name };
        }
        default:
          throw new Error(`Unknown organization command: ${command}`);
      }
    });
  }
  var init_organization = __esm({
    "src/handlers/organization.ts"() {
      "use strict";
    }
  });

  // src/handlers/export.ts
  function handleExport(params) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      const p = params;
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      const scene = node;
      if (!("exportAsync" in scene)) {
        throw new Error(`Node ${p.nodeId} does not support export`);
      }
      const format = (_a = p.format) != null ? _a : "PNG";
      const scale = (_b = p.scale) != null ? _b : 1;
      const bytes = yield scene.exportAsync(__spreadValues({
        format
      }, format !== "SVG" ? { constraint: { type: "SCALE", value: scale } } : {}));
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      const mimeTypes = {
        PNG: "image/png",
        JPG: "image/jpeg",
        SVG: "image/svg+xml",
        PDF: "application/pdf"
      };
      return {
        base64,
        format,
        mimeType: (_c = mimeTypes[format]) != null ? _c : "application/octet-stream",
        size: bytes.length
      };
    });
  }
  var init_export = __esm({
    "src/handlers/export.ts"() {
      "use strict";
    }
  });

  // src/handlers/components.ts
  function handleComponents(command, params) {
    return __async(this, null, function* () {
      var _a, _b;
      const p = params;
      switch (command) {
        case "list_components": {
          const components = figma.currentPage.findAllWithCriteria({ types: ["COMPONENT"] });
          const filtered = p.nameFilter ? components.filter((c) => c.name.toLowerCase().includes(p.nameFilter.toLowerCase())) : components;
          return {
            components: filtered.map((c) => ({
              id: c.id,
              name: c.name,
              description: c.description,
              key: c.key,
              width: c.width,
              height: c.height
            }))
          };
        }
        case "create_instance": {
          const componentNode = figma.getNodeById(p.componentId);
          if (!componentNode) throw new Error(`Component not found: ${p.componentId}`);
          if (componentNode.type !== "COMPONENT") throw new Error(`Node ${p.componentId} is not a component (got ${componentNode.type})`);
          const instance = componentNode.createInstance();
          instance.x = (_a = p.x) != null ? _a : 0;
          instance.y = (_b = p.y) != null ? _b : 0;
          if (p.parentId) {
            const parent = figma.getNodeById(p.parentId);
            if (!parent) throw new Error(`Parent node not found: ${p.parentId}`);
            if (!("children" in parent)) throw new Error(`Node ${p.parentId} cannot have children`);
            parent.appendChild(instance);
          }
          return { nodeId: instance.id, name: instance.name, type: instance.type };
        }
        case "set_overrides": {
          const node = figma.getNodeById(p.nodeId);
          if (!node) throw new Error(`Node not found: ${p.nodeId}`);
          if (node.type !== "INSTANCE") throw new Error(`Node ${p.nodeId} is not a component instance (got ${node.type})`);
          const instance = node;
          const props = {};
          for (const override of p.overrides) {
            props[override.propertyName] = override.value;
          }
          instance.setProperties(props);
          return { success: true, nodeId: p.nodeId };
        }
        case "swap_component": {
          const instanceNode = figma.getNodeById(p.instanceId);
          if (!instanceNode) throw new Error(`Instance not found: ${p.instanceId}`);
          if (instanceNode.type !== "INSTANCE") throw new Error(`Node ${p.instanceId} is not a component instance (got ${instanceNode.type})`);
          const newComponent = figma.getNodeById(p.newComponentId);
          if (!newComponent) throw new Error(`Component not found: ${p.newComponentId}`);
          if (newComponent.type !== "COMPONENT") throw new Error(`Node ${p.newComponentId} is not a component (got ${newComponent.type})`);
          instanceNode.swapComponent(newComponent);
          return { success: true, instanceId: p.instanceId, newComponentId: p.newComponentId };
        }
        default:
          throw new Error(`Unknown component command: ${command}`);
      }
    });
  }
  var init_components = __esm({
    "src/handlers/components.ts"() {
      "use strict";
    }
  });

  // src/handlers/variables.ts
  function handleVariables(command, params) {
    return __async(this, null, function* () {
      const p = params;
      switch (command) {
        case "list_variables": {
          const collections = figma.variables.getLocalVariableCollections();
          const results = collections.filter((c) => !p.collectionName || c.name.toLowerCase().includes(p.collectionName.toLowerCase())).map((collection) => {
            const variables = collection.variableIds.map((id) => {
              const variable = figma.variables.getVariableById(id);
              if (!variable) return null;
              return {
                id: variable.id,
                name: variable.name,
                resolvedType: variable.resolvedType,
                valuesByMode: Object.fromEntries(
                  Object.entries(variable.valuesByMode).map(([modeId, value]) => {
                    var _a;
                    const mode = collection.modes.find((m) => m.modeId === modeId);
                    return [(_a = mode == null ? void 0 : mode.name) != null ? _a : modeId, value];
                  })
                )
              };
            }).filter(Boolean);
            return {
              collectionId: collection.id,
              collectionName: collection.name,
              modes: collection.modes.map((m) => ({ modeId: m.modeId, name: m.name })),
              variables
            };
          });
          return { collections: results };
        }
        case "bind_variable": {
          const node = figma.getNodeById(p.nodeId);
          if (!node) throw new Error(`Node not found: ${p.nodeId}`);
          const variable = figma.variables.getVariableById(p.variableId);
          if (!variable) throw new Error(`Variable not found: ${p.variableId}`);
          const scene = node;
          if (p.field === "fills" && "fills" in scene) {
            const fills = scene.fills;
            if (fills.length === 0) throw new Error("Node has no fills to bind variable to");
            const newFills = [...fills];
            newFills[0] = figma.variables.setBoundVariableForPaint(newFills[0], "color", variable);
            scene.fills = newFills;
          } else if (p.field === "strokes" && "strokes" in scene) {
            const strokes = scene.strokes;
            if (strokes.length === 0) throw new Error("Node has no strokes to bind variable to");
            const newStrokes = [...strokes];
            newStrokes[0] = figma.variables.setBoundVariableForPaint(newStrokes[0], "color", variable);
            scene.strokes = newStrokes;
          } else {
            scene.setBoundVariable(p.field, variable);
          }
          return { success: true, nodeId: p.nodeId, variableId: p.variableId, field: p.field };
        }
        default:
          throw new Error(`Unknown variables command: ${command}`);
      }
    });
  }
  var init_variables = __esm({
    "src/handlers/variables.ts"() {
      "use strict";
    }
  });

  // src/handlers/vectors.ts
  function getParent2(parentId) {
    if (parentId) {
      const node = figma.getNodeById(parentId);
      if (!node) throw new Error(`Parent node not found: ${parentId}`);
      if (!("children" in node)) throw new Error(`Node ${parentId} cannot have children`);
      return node;
    }
    return figma.currentPage;
  }
  function handleVectors(command, params) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e;
      const p = params;
      switch (command) {
        case "create_vector": {
          const vector = figma.createVector();
          vector.name = (_a = p.name) != null ? _a : "Vector";
          vector.x = (_b = p.x) != null ? _b : 0;
          vector.y = (_c = p.y) != null ? _c : 0;
          vector.vectorPaths = p.paths.map((path) => {
            var _a2;
            return {
              data: path.data,
              windingRule: (_a2 = path.windingRule) != null ? _a2 : "NONZERO"
            };
          });
          if (p.width && p.height) {
            vector.resize(p.width, p.height);
          }
          if (p.fills && p.fills.length > 0) {
            vector.fills = p.fills.map((f) => {
              var _a2;
              if (f.type === "SOLID" && f.color) {
                return {
                  type: "SOLID",
                  color: { r: f.color.r, g: f.color.g, b: f.color.b },
                  opacity: (_a2 = f.opacity) != null ? _a2 : 1
                };
              }
              return { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
            });
          }
          const parent = getParent2(p.parentId);
          parent.appendChild(vector);
          return { nodeId: vector.id, name: vector.name, type: vector.type };
        }
        case "create_from_svg": {
          const svgNode = figma.createNodeFromSvg(p.svg);
          svgNode.x = (_d = p.x) != null ? _d : 0;
          svgNode.y = (_e = p.y) != null ? _e : 0;
          if (p.name) svgNode.name = p.name;
          if (p.parentId) {
            const parent = getParent2(p.parentId);
            parent.appendChild(svgNode);
          }
          return { nodeId: svgNode.id, name: svgNode.name, type: svgNode.type };
        }
        case "boolean_operation": {
          const nodes = [];
          for (const id of p.nodeIds) {
            const node = figma.getNodeById(id);
            if (!node) throw new Error(`Node not found: ${id}`);
            nodes.push(node);
          }
          if (nodes.length < 2) throw new Error("Boolean operations require at least 2 nodes");
          const parentNode = nodes[0].parent;
          let result;
          switch (p.operation) {
            case "UNION":
              result = figma.union(nodes, parentNode);
              break;
            case "SUBTRACT":
              result = figma.subtract(nodes, parentNode);
              break;
            case "INTERSECT":
              result = figma.intersect(nodes, parentNode);
              break;
            case "EXCLUDE":
              result = figma.exclude(nodes, parentNode);
              break;
            default:
              throw new Error(`Unknown boolean operation: ${p.operation}`);
          }
          if (p.name) result.name = p.name;
          return { nodeId: result.id, name: result.name, type: result.type };
        }
        default:
          throw new Error(`Unknown vector command: ${command}`);
      }
    });
  }
  var init_vectors = __esm({
    "src/handlers/vectors.ts"() {
      "use strict";
    }
  });

  // src/handlers/design-system.ts
  function handleDesignSystem(command, params) {
    return __async(this, null, function* () {
      var _a, _b;
      const p = params;
      switch (command) {
        // ── Variable Creation ──
        case "create_variable_collection": {
          const collection = figma.variables.createVariableCollection(p.name);
          if (p.modes && p.modes.length > 0) {
            collection.renameMode(collection.modes[0].modeId, p.modes[0]);
            for (let i = 1; i < p.modes.length; i++) {
              collection.addMode(p.modes[i]);
            }
          }
          return {
            collectionId: collection.id,
            name: collection.name,
            modes: collection.modes.map((m) => ({ modeId: m.modeId, name: m.name }))
          };
        }
        case "create_variable": {
          const collection = figma.variables.getVariableCollectionById(p.collectionId);
          if (!collection) throw new Error(`Collection not found: ${p.collectionId}`);
          const variable = figma.variables.createVariable(p.name, collection, p.resolvedType);
          if (p.values) {
            for (const [modeName, value] of Object.entries(p.values)) {
              const mode = collection.modes.find((m) => m.name === modeName);
              if (!mode) throw new Error(`Mode not found: ${modeName}`);
              variable.setValueForMode(mode.modeId, value);
            }
          }
          return {
            variableId: variable.id,
            name: variable.name,
            resolvedType: variable.resolvedType,
            collectionId: p.collectionId
          };
        }
        case "set_variable_value": {
          const variable = figma.variables.getVariableById(p.variableId);
          if (!variable) throw new Error(`Variable not found: ${p.variableId}`);
          const collectionId = variable.variableCollectionId;
          const collection = figma.variables.getVariableCollectionById(collectionId);
          if (!collection) throw new Error(`Collection not found for variable: ${p.variableId}`);
          const mode = collection.modes.find((m) => m.name === p.modeName);
          if (!mode) throw new Error(`Mode not found: ${p.modeName}`);
          variable.setValueForMode(mode.modeId, p.value);
          return { success: true, variableId: p.variableId, modeName: p.modeName };
        }
        // ── Style Creation ──
        case "create_paint_style": {
          const style = figma.createPaintStyle();
          style.name = p.name;
          if (p.description) style.description = p.description;
          style.paints = p.paints.map((paint) => {
            var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
            switch (paint.type) {
              case "SOLID":
                return {
                  type: "SOLID",
                  color: { r: (_b2 = (_a2 = paint.color) == null ? void 0 : _a2.r) != null ? _b2 : 0, g: (_d = (_c = paint.color) == null ? void 0 : _c.g) != null ? _d : 0, b: (_f = (_e = paint.color) == null ? void 0 : _e.b) != null ? _f : 0 },
                  opacity: (_g = paint.opacity) != null ? _g : 1,
                  visible: (_h = paint.visible) != null ? _h : true
                };
              case "GRADIENT_LINEAR":
              case "GRADIENT_RADIAL":
              case "GRADIENT_ANGULAR":
              case "GRADIENT_DIAMOND":
                return {
                  type: paint.type,
                  gradientStops: ((_i = paint.gradientStops) != null ? _i : []).map((s) => {
                    var _a3;
                    return {
                      position: s.position,
                      color: { r: s.color.r, g: s.color.g, b: s.color.b, a: (_a3 = s.color.a) != null ? _a3 : 1 }
                    };
                  }),
                  gradientTransform: (_j = paint.gradientTransform) != null ? _j : [[1, 0, 0], [0, 1, 0]],
                  opacity: (_k = paint.opacity) != null ? _k : 1,
                  visible: (_l = paint.visible) != null ? _l : true
                };
              default:
                return { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
            }
          });
          return { styleId: style.id, name: style.name, key: style.key };
        }
        case "create_text_style": {
          const style = figma.createTextStyle();
          style.name = p.name;
          if (p.description) style.description = p.description;
          const family = (_a = p.fontFamily) != null ? _a : "Inter";
          const weight = (_b = p.fontWeight) != null ? _b : "Regular";
          yield figma.loadFontAsync({ family, style: weight });
          style.fontName = { family, style: weight };
          style.fontSize = p.fontSize;
          if (p.lineHeight !== void 0) {
            style.lineHeight = { value: p.lineHeight, unit: "PIXELS" };
          }
          if (p.letterSpacing !== void 0) {
            style.letterSpacing = { value: p.letterSpacing, unit: "PIXELS" };
          }
          if (p.textAlignHorizontal) {
          }
          return { styleId: style.id, name: style.name, key: style.key };
        }
        case "create_effect_style": {
          const style = figma.createEffectStyle();
          style.name = p.name;
          if (p.description) style.description = p.description;
          style.effects = p.effects.map((e) => {
            var _a2, _b2, _c, _d, _e;
            return {
              type: e.type,
              visible: (_a2 = e.visible) != null ? _a2 : true,
              radius: (_b2 = e.radius) != null ? _b2 : 0,
              color: e.color ? { r: e.color.r, g: e.color.g, b: e.color.b, a: (_c = e.color.a) != null ? _c : 1 } : { r: 0, g: 0, b: 0, a: 0.25 },
              offset: (_d = e.offset) != null ? _d : { x: 0, y: 0 },
              spread: (_e = e.spread) != null ? _e : 0
            };
          });
          return { styleId: style.id, name: style.name, key: style.key };
        }
        // ── Component Variants ──
        case "combine_as_variants": {
          const components = [];
          for (const id of p.componentIds) {
            const node = figma.getNodeById(id);
            if (!node) throw new Error(`Node not found: ${id}`);
            if (node.type !== "COMPONENT") throw new Error(`Node ${id} is not a component (got ${node.type})`);
            components.push(node);
          }
          const parent = components[0].parent;
          const componentSet = figma.combineAsVariants(components, parent);
          if (p.name) componentSet.name = p.name;
          return {
            nodeId: componentSet.id,
            name: componentSet.name,
            type: componentSet.type,
            variantCount: components.length
          };
        }
        case "add_component_property": {
          const node = figma.getNodeById(p.componentId);
          if (!node) throw new Error(`Node not found: ${p.componentId}`);
          if (node.type !== "COMPONENT" && node.type !== "COMPONENT_SET") {
            throw new Error(`Node ${p.componentId} is not a component/component set (got ${node.type})`);
          }
          const comp = node;
          comp.addComponentProperty(p.propertyName, p.propertyType, p.defaultValue);
          return { success: true, componentId: p.componentId, propertyName: p.propertyName };
        }
        default:
          throw new Error(`Unknown design system command: ${command}`);
      }
    });
  }
  var init_design_system = __esm({
    "src/handlers/design-system.ts"() {
      "use strict";
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"(exports) {
      init_creation();
      init_styling();
      init_layout();
      init_reading();
      init_mutation();
      init_organization();
      init_export();
      init_components();
      init_variables();
      init_vectors();
      init_design_system();
      figma.showUI(__html__, { visible: true, width: 300, height: 380 });
      figma.ui.onmessage = (msg) => __async(exports, null, function* () {
        var _a;
        if (!msg || !msg.id || !msg.command) return;
        let response;
        try {
          const data = yield dispatch(msg.command, msg.params);
          response = { id: msg.id, success: true, data };
        } catch (err) {
          response = { id: msg.id, success: false, error: (_a = err.message) != null ? _a : String(err) };
        }
        figma.ui.postMessage(response);
      });
      function dispatch(command, params) {
        return __async(this, null, function* () {
          switch (command) {
            // Creation
            case "create_frame":
            case "create_component":
            case "create_section":
            case "add_text":
            case "add_rectangle":
            case "add_ellipse":
            case "add_shape":
            case "clone_node":
            case "set_image_fill":
              return handleCreation(command, params);
            // Vectors
            case "create_vector":
            case "create_from_svg":
            case "boolean_operation":
              return handleVectors(command, params);
            // Styling
            case "set_styles":
            case "list_styles":
            case "apply_style":
              return handleStyling(command, params);
            // Layout
            case "apply_auto_layout":
              return handleLayout(params);
            // Reading
            case "read_current_page":
            case "get_node_by_id":
            case "get_selection":
              return handleReading(command, params);
            // Mutation
            case "edit_node":
            case "delete_node":
              return handleMutation(command, params);
            // Organization
            case "group_nodes":
            case "flatten_node":
            case "create_page":
              return handleOrganization(command, params);
            // Components (instances)
            case "list_components":
            case "create_instance":
            case "set_overrides":
            case "swap_component":
              return handleComponents(command, params);
            // Variables (read/bind)
            case "list_variables":
            case "bind_variable":
              return handleVariables(command, params);
            // Design System (creation)
            case "create_variable_collection":
            case "create_variable":
            case "set_variable_value":
            case "create_paint_style":
            case "create_text_style":
            case "create_effect_style":
            case "combine_as_variants":
            case "add_component_property":
              return handleDesignSystem(command, params);
            // Export
            case "export_node":
              return handleExport(params);
            // System
            case "ping":
              return { status: "ok", page: figma.currentPage.name };
            default:
              throw new Error(`Unknown command: ${command}`);
          }
        });
      }
    }
  });
  require_main();
})();
