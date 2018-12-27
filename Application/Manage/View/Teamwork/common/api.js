define([
    'WebmCommon/api'
], function(
    CommonApi
){
    var Api = CommonApi.Api;

    return {
        homeGalleryApi: new Api('/s/gallery/getHomeData'),
        getProductDetailApi: new Api('/s/shop/product/getDetail'),
        getSlideApi: new Api('/s/sitebanner/getSlideByType'),
        getProductListApi: new Api('/s/product-list/getByCategory'),
        getProductsByBomApi: new Api('/s/product-list/getByBom'),

        searchProductsApi: new Api('/s/shop/product/search'),

        getBrandDetailV2: new Api('/s/gallery/getBrandDetailV2'),
        getExhibit: new Api('/m/s/fnjiexhibit/get'),

        addCartApi: new Api('/s/cart/add-goods'),

        sendVerifyCodeApi: new Api('/s/member/sendVerifyCode'),
        addBespeakApi: new Api('/m/s/shappointv2/add'),//添加预约
        cancelBespeakApi: new Api('/m/s/shappointv2/cancel'), //撤销预约
        getTimeSlotApi: new Api('/m/s/shappointv2/getTimeSlot'),//获取预约时间
        getAppointApi: new Api('/m/s/shappointv2/getAppoint'),//获取我的预约
        addFeedBackApi: new Api('/m/s/shappointv2/addFeedBack'),//添加评价信息
        getFeedBackApi: new Api('/m/s/shappointv2/getFeedBack'),//查询评价信息
        updateConfirmApi: new Api('/m/s/shappointv2/confirm'),//确认预约
        isSubscribeWxApi: new Api('/m/s/shappointv2/isSubscribeWx'), //是否关注公众号
        getPhoneAppointNum: new Api('/m/s/shappointv2/getPhoneAppointNum'),
        changeLanguage: new Api('/m/s/shappointv2/changeLanguage'),//中英文

    };
});
