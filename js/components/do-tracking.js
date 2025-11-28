// Komponen DO Tracking
Vue.component('do-tracking', {
    template: '#tpl-do-tracking',
    data() {
        return {
            tracking: [],
            paketList: [],
            pengirimanList: [],
            showAddDOForm: false,
            searchQuery: '',
            newDO: {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                tanggalKirim: '',
                total: 0
            },
            selectedPaketDetail: null,
            newProgress: {}
        };
    },
    async mounted() {
        await this.loadData();
        // Set tanggal kirim default ke hari ini
        const today = new Date();
        this.newDO.tanggalKirim = today.toISOString().split('T')[0];
    },
    computed: {
        filteredTracking() {
            if (!this.searchQuery) {
                return this.tracking;
            }
            
            const query = this.searchQuery.toLowerCase();
            return this.tracking.filter(track => {
                const doNumber = this.getDONumber(track);
                return doNumber.toLowerCase().includes(query) || 
                       track.nim.toLowerCase().includes(query);
            });
        }
    },
    methods: {
        async loadData() {
            try {
                const data = await DataService.fetchData();
                // Convert tracking dari format array of objects ke array flat
                this.tracking = [];
                if (data.tracking && Array.isArray(data.tracking)) {
                    data.tracking.forEach(item => {
                        Object.keys(item).forEach(doNumber => {
                            this.tracking.push({
                                doNumber: doNumber,
                                ...item[doNumber]
                            });
                        });
                    });
                }
                this.paketList = data.paket || [];
                // Convert pengirimanList ke format JNE
                if (data.pengirimanList) {
                    this.pengirimanList = data.pengirimanList.map(p => {
                        if (p.kode === 'REG') {
                            return { kode: p.kode, nama: 'JNE Regular' };
                        } else if (p.kode === 'EXP') {
                            return { kode: p.kode, nama: 'JNE Express' };
                        }
                        return p;
                    });
                } else {
                    // Fallback jika tidak ada data
                    this.pengirimanList = [
                        { kode: 'REG', nama: 'JNE Regular' },
                        { kode: 'EXP', nama: 'JNE Express' }
                    ];
                }
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Gagal memuat data');
            }
        },
        generateDONumber() {
            const year = new Date().getFullYear();
            const existingDOs = this.tracking
                .map(t => t.doNumber)
                .filter(doNum => doNum.startsWith(`DO${year}-`))
                .map(doNum => {
                    const match = doNum.match(/DO\d{4}-(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                });
            
            const maxSeq = existingDOs.length > 0 ? Math.max(...existingDOs) : 0;
            const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
            return `DO${year}-${nextSeq}`;
        },
        onPaketChange() {
            if (this.newDO.paket) {
                this.selectedPaketDetail = this.paketList.find(p => p.kode === this.newDO.paket);
                if (this.selectedPaketDetail) {
                    this.newDO.total = this.selectedPaketDetail.harga;
                }
            } else {
                this.selectedPaketDetail = null;
                this.newDO.total = 0;
            }
        },
        formatCurrency(value) {
            return `Rp ${value.toLocaleString('id-ID')}`;
        },
        formatDate(dateString) {
            if (!dateString) {
                // Jika tidak ada tanggal, gunakan tanggal hari ini
                const today = new Date();
                const months = [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
            }
            const date = new Date(dateString + 'T00:00:00');
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        },
        getDONumber(track) {
            return track.doNumber || Object.keys(track).find(key => key.startsWith('DO'));
        },
        handleAddDOSubmit() {
            // Validasi
            if (!this.newDO.nim || !this.newDO.nama || !this.newDO.ekspedisi || !this.newDO.paket) {
                alert('Mohon lengkapi semua field yang wajib diisi');
                return;
            }
            
            if (!this.selectedPaketDetail) {
                alert('Mohon pilih paket bahan ajar');
                return;
            }
            
            // Generate DO Number
            const doNumber = this.generateDONumber();
            
            // Format tanggal kirim
            let tanggalKirim = this.newDO.tanggalKirim;
            if (!tanggalKirim) {
                const today = new Date();
                tanggalKirim = today.toISOString().split('T')[0];
            }
            
            // Buat tracking baru
            const newTracking = {
                doNumber: doNumber,
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                status: 'Dalam Perjalanan',
                ekspedisi: this.newDO.ekspedisi,
                tanggalKirim: tanggalKirim,
                paket: this.newDO.paket,
                total: this.newDO.total,
                perjalanan: [{
                    waktu: new Date().toLocaleString('id-ID'),
                    keterangan: 'Penerimaan di Loket: ' + (this.newDO.ekspedisi || 'TANGSEL')
                }]
            };
            
            this.tracking.push(newTracking);
            
            // Reset form
            this.newDO = {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                tanggalKirim: new Date().toISOString().split('T')[0],
                total: 0
            };
            this.selectedPaketDetail = null;
            this.showAddDOForm = false;
        },
        handleSearch() {
            // Pencarian sudah di-handle oleh computed filteredTracking
        },
        resetSearch() {
            this.searchQuery = '';
        },
        addProgress(doNumber) {
            const keterangan = this.newProgress[doNumber];
            if (!keterangan) {
                alert('Mohon isi keterangan');
                return;
            }
            
            const track = this.tracking.find(t => this.getDONumber(t) === doNumber);
            if (track) {
                if (!track.perjalanan) {
                    track.perjalanan = [];
                }
                track.perjalanan.push({
                    waktu: new Date().toLocaleString('id-ID'),
                    keterangan: keterangan
                });
                this.newProgress[doNumber] = '';
            }
        }
    }
});

