export declare const CommandType: {
    readonly CREATE_FRAME: "create_frame";
    readonly CREATE_COMPONENT: "create_component";
    readonly ADD_TEXT: "add_text";
    readonly ADD_RECTANGLE: "add_rectangle";
    readonly ADD_ELLIPSE: "add_ellipse";
    readonly ADD_SHAPE: "add_shape";
    readonly SET_STYLES: "set_styles";
    readonly LIST_STYLES: "list_styles";
    readonly APPLY_STYLE: "apply_style";
    readonly APPLY_AUTO_LAYOUT: "apply_auto_layout";
    readonly READ_CURRENT_PAGE: "read_current_page";
    readonly GET_NODE_BY_ID: "get_node_by_id";
    readonly LIST_COMPONENTS: "list_components";
    readonly CREATE_INSTANCE: "create_instance";
    readonly SET_OVERRIDES: "set_overrides";
    readonly SWAP_COMPONENT: "swap_component";
    readonly LIST_VARIABLES: "list_variables";
    readonly BIND_VARIABLE: "bind_variable";
    readonly EDIT_NODE: "edit_node";
    readonly DELETE_NODE: "delete_node";
    readonly GROUP_NODES: "group_nodes";
    readonly FLATTEN_NODE: "flatten_node";
    readonly CREATE_PAGE: "create_page";
    readonly EXPORT_NODE: "export_node";
    readonly PING: "ping";
};
export type CommandType = (typeof CommandType)[keyof typeof CommandType];
//# sourceMappingURL=commands.d.ts.map