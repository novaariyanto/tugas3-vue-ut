// Komponen Stock Table
Vue.component('ba-stock-table', {
    template: '#tpl-stock-table',
    data() {
        return {
            stok: [],
            upbjjList: [],
            kategoriList: [],
            showAddForm: false,
            editingItem: null,
            filterUpbjj: '',
            filterKategori: '',
            filterLowStock: false,
            sortBy: '',
            sortOrder: 'asc',
            newItem: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            }
        };
    },
    async mounted() {
        await this.loadData();
    },
    computed: {
        // Kategori yang tersedia berdasarkan filter UT-Daerah
        filteredKategoriList() {
            if (!this.filterUpbjj) {
                return this.kategoriList;
            }
            const filteredStok = this.stok.filter(item => item.upbjj === this.filterUpbjj);
            const kategoriSet = new Set(filteredStok.map(item => item.kategori));
            return Array.from(kategoriSet).sort();
        },
        // Filter dan sort tanpa recompute
        filteredAndSortedStok() {
            let filtered = [...this.stok];
            
            // Filter UT-Daerah
            if (this.filterUpbjj) {
                filtered = filtered.filter(item => item.upbjj === this.filterUpbjj);
            }
            
            // Filter Kategori
            if (this.filterKategori) {
                filtered = filtered.filter(item => item.kategori === this.filterKategori);
            }
            
            // Filter Low Stock
            if (this.filterLowStock) {
                filtered = filtered.filter(item => item.qty < item.safety || item.qty === 0);
            }
            
            // Sort
            if (this.sortBy) {
                filtered.sort((a, b) => {
                    let aVal = a[this.sortBy];
                    let bVal = b[this.sortBy];
                    
                    if (typeof aVal === 'string') {
                        aVal = aVal.toLowerCase();
                        bVal = bVal.toLowerCase();
                    }
                    
                    if (this.sortOrder === 'asc') {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });
            }
            
            return filtered;
        }
    },
    methods: {
        async loadData() {
            try {
                const data = await DataService.fetchData();
                this.stok = data.stok || [];
                this.upbjjList = data.upbjjList || [];
                this.kategoriList = data.kategoriList || [];
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Gagal memuat data');
            }
        },
        formatCurrency(value) {
            return `Rp ${value.toLocaleString('id-ID')}`;
        },
        formatQty(value) {
            return `${value} buah`;
        },
        onUpbjjChange() {
            // Reset kategori filter ketika UT-Daerah berubah
            this.filterKategori = '';
        },
        resetFilter() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterLowStock = false;
            this.sortBy = '';
            this.sortOrder = 'asc';
        },
        handleAddSubmit() {
            // Validasi
            if (!this.newItem.kode || !this.newItem.judul || !this.newItem.kategori || 
                !this.newItem.upbjj || !this.newItem.lokasiRak || 
                this.newItem.harga <= 0 || this.newItem.qty < 0 || this.newItem.safety < 0) {
                alert('Mohon lengkapi semua field yang wajib diisi');
                return;
            }
            
            // Cek duplikasi kode di UT-Daerah yang sama
            const exists = this.stok.find(item => 
                item.kode === this.newItem.kode && item.upbjj === this.newItem.upbjj
            );
            if (exists) {
                alert('Kode mata kuliah sudah ada untuk UT-Daerah ini');
                return;
            }
            
            // Tambah data
            this.stok.push({ ...this.newItem });
            
            // Reset form
            this.newItem = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
            this.showAddForm = false;
        },
        editItem(item) {
            this.editingItem = { ...item };
            this.showAddForm = false;
        },
        cancelEdit() {
            this.editingItem = null;
        },
        handleUpdateSubmit() {
            // Validasi
            if (!this.editingItem.kode || !this.editingItem.judul || !this.editingItem.kategori || 
                !this.editingItem.upbjj || !this.editingItem.lokasiRak || 
                this.editingItem.harga <= 0 || this.editingItem.qty < 0 || this.editingItem.safety < 0) {
                alert('Mohon lengkapi semua field yang wajib diisi');
                return;
            }
            
            // Update data
            const index = this.stok.findIndex(item => 
                item.kode === this.editingItem.kode && item.upbjj === this.editingItem.upbjj
            );
            if (index !== -1) {
                this.$set(this.stok, index, { ...this.editingItem });
            }
            
            this.editingItem = null;
        },
        deleteItem(item) {
            this.$root.showModal = true;
            this.$root.modalTitle = 'Konfirmasi Hapus';
            this.$root.modalMessage = `Apakah Anda yakin ingin menghapus data bahan ajar "${item.judul}" (${item.kode})?`;
            this.$root.modalType = 'delete';
            this.$root.deleteItemRef = item;
            this.$root.deleteCallback = () => {
                const index = this.stok.findIndex(s => 
                    s.kode === item.kode && s.upbjj === item.upbjj
                );
                if (index !== -1) {
                    this.stok.splice(index, 1);
                }
            };
        }
    }
});

