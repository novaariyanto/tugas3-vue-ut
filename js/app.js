// Root Vue Instance
const app = new Vue({
    el: '#app',
    data: {
        currentTab: 'stok',
        showModal: false,
        modalTitle: '',
        modalMessage: '',
        modalType: 'confirm',
        deleteItemRef: null,
        deleteCallback: null
    },
    methods: {
        handleModalConfirm() {
            if (this.modalType === 'delete' && this.deleteCallback) {
                this.deleteCallback();
                this.deleteCallback = null;
                this.deleteItemRef = null;
            }
            this.showModal = false;
        },
        handleModalCancel() {
            this.showModal = false;
            this.deleteItemRef = null;
            this.deleteCallback = null;
        }
    }
});

