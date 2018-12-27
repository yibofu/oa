define([
    'jquery',
    'moment',
    'bsDateTimePicker'
], function(
    $,
    moment
){
    var TimeFormat = 'YYYY-MM-DD HH:mm:ss';

    return {
        template: '<input type="text" class="form-control"/>',
        props: {
            value: {
                type: String
            }
        },
        watch: {
            value: function(newValue){
                $(this.$el).data('DateTimePicker').date(newValue);
            }
        },
        mounted: function(){
            var _this = this;
            var defaultDate = this.value;
            if (!defaultDate){
                defaultDate = moment();
                this.$emit('input', defaultDate.format(TimeFormat));
            }
            $(this.$el).datetimepicker({
                format: TimeFormat,
                defaultDate: defaultDate
            }).on('dp.change', function(e){
                _this.$emit('input', e.date.format(TimeFormat));
            });
        }
    };
});