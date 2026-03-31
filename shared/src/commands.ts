export const CommandType = {
  // Creation
  CREATE_FRAME: "create_frame",
  CREATE_COMPONENT: "create_component",
  CREATE_SECTION: "create_section",
  ADD_TEXT: "add_text",
  ADD_RECTANGLE: "add_rectangle",
  ADD_ELLIPSE: "add_ellipse",
  ADD_SHAPE: "add_shape",
  CLONE_NODE: "clone_node",

  // Vectors
  CREATE_VECTOR: "create_vector",
  CREATE_FROM_SVG: "create_from_svg",
  BOOLEAN_OPERATION: "boolean_operation",

  // Styling
  SET_STYLES: "set_styles",
  LIST_STYLES: "list_styles",
  APPLY_STYLE: "apply_style",
  SET_IMAGE_FILL: "set_image_fill",

  // Layout
  APPLY_AUTO_LAYOUT: "apply_auto_layout",

  // Reading
  READ_CURRENT_PAGE: "read_current_page",
  GET_NODE_BY_ID: "get_node_by_id",
  GET_SELECTION: "get_selection",

  // Components
  LIST_COMPONENTS: "list_components",
  CREATE_INSTANCE: "create_instance",
  SET_OVERRIDES: "set_overrides",
  SWAP_COMPONENT: "swap_component",
  COMBINE_AS_VARIANTS: "combine_as_variants",
  ADD_COMPONENT_PROPERTY: "add_component_property",

  // Variables
  LIST_VARIABLES: "list_variables",
  BIND_VARIABLE: "bind_variable",
  CREATE_VARIABLE_COLLECTION: "create_variable_collection",
  CREATE_VARIABLE: "create_variable",
  SET_VARIABLE_VALUE: "set_variable_value",

  // Styles (creation)
  CREATE_PAINT_STYLE: "create_paint_style",
  CREATE_TEXT_STYLE: "create_text_style",
  CREATE_EFFECT_STYLE: "create_effect_style",

  // Mutation
  EDIT_NODE: "edit_node",
  DELETE_NODE: "delete_node",

  // Organization
  GROUP_NODES: "group_nodes",
  FLATTEN_NODE: "flatten_node",
  CREATE_PAGE: "create_page",

  // Export
  EXPORT_NODE: "export_node",

  // System
  PING: "ping",
} as const;

export type CommandType = (typeof CommandType)[keyof typeof CommandType];
