new Vue({
    el: '#app',
    data: {
        currencies: {},
        amount: 0,
        from: 'EUR',
        to: 'USD',
        result: 0,
        loading: false
    },
    mounted() {
        this.getCurrences();
    },
    computed: {
        formattedCurrencies() {
            return Object.values(this.currencies);
        },
        culculateResult() {
            return (Number(this.amount) * this.result).toFixed(2);
        },
        disabled() {
            return this.amount === 0 || !this.amount || this.loading;
        }
    },

    methods: {
        getCurrences() {
            const currencies = localStorage.getItem('currencies');
            if (currencies) {
                this.currencies = JSON.parse(currencies);
                return;
            }
            //mounted hook is called soon after vue js object is created
            //make Api request
            axios.get('https://free.currconv.com/api/v7/currencies?apiKey=sample-key-do-not-use')
                .then(response => {
                    this.currencies = response.data.results;
                    localStorage.setItem('currencies', JSON.stringify(response.data.results))
                });
        },
        convertCurrency() {
            const key = `${this.from}_${this.to}`;
            this.loading = true
            axios.get(`https://free.currconv.com/api/v7/convert?q=${key}&apiKey=sample-key-do-not-use`)
                .then((response) => {
                    this.loading = false;
                    this.result = response.data.results[key].val;

                });
        }
    },
    watch: {
        from() {
            this.result = 0;
        },
        to() {
            this.result = 0;
        }
    }
})