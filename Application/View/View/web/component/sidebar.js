define([
    'text!WebComponent/sidebar.html'
], function(
    tpl,
    SidebarItem
){
    return {
        template: tpl,
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    };
});