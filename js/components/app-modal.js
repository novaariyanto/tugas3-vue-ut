// Komponen Modal
Vue.component('app-modal', {
    template: '#tpl-app-modal',
    props: {
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'confirm'
        }
    }
});

