// Komponen Status Badge
Vue.component('status-badge', {
    template: '#tpl-status-badge',
    props: {
        qty: {
            type: Number,
            required: true
        },
        safety: {
            type: Number,
            required: true
        },
        catatan: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showTooltip: false
        };
    },
    computed: {
        statusClass() {
            if (this.qty === 0) {
                return 'status-kosong';
            } else if (this.qty < this.safety) {
                return 'status-menipis';
            } else {
                return 'status-aman';
            }
        },
        statusText() {
            if (this.qty === 0) {
                return '⚠️ Kosong';
            } else if (this.qty < this.safety) {
                return '⚠️ Menipis';
            } else {
                return '✓ Aman';
            }
        }
    }
});

