import { defineStore } from 'pinia';
import useApiReq from '~/composables/useApiReq';

const APIKEY = '0641899320';
export const useLocationinfoRest = defineStore('locationinfoRest', {
  state: () => ({
    locationinfoRest: [],
    restDetail: null,
    isLoadingRestDetail: false,
  }),
  getters: {
    getLocationinfoRest: (state) => state.locationinfoRest,
    getRestDetail: (state) => state.restDetail,
    getIsLoadingRestDetail: (state) => state.isLoadingRestDetail,
  },
  actions: {
    async GET_LocationinfoRest() {
      const data1 = await useApiReq(`/locationinfo/locationinfoRest?key=${APIKEY}&type=json&numOfRows=99&pageNo=1`);
      const data2 = await useApiReq(`/locationinfo/locationinfoRest?key=${APIKEY}&type=json&numOfRows=99&pageNo=2`);
      const data3 = await useApiReq(`/locationinfo/locationinfoRest?key=${APIKEY}&type=json&numOfRows=99&pageNo=3`);
      const data = [...data1.data._rawValue.list, ...data2.data._rawValue.list, ...data3.data._rawValue.list];
      if (data1.data._rawValue.code !== 'SUCCESS') {
        alert(data1.data._rawValue.message);
        return;
      }
      if (data2.data._rawValue.code !== 'SUCCESS') {
        alert(data2.data._rawValue.message);
        return;
      }
      if (data3.data._rawValue.code !== 'SUCCESS') {
        alert(data3.data._rawValue.message);
        return;
      }
      this.locationinfoRest = data.map(({ unitName, routeName, xValue, yValue, stdRestCd }) => {
        return {
          title: unitName,
          text: routeName,
          latlng: new kakao.maps.LatLng(yValue, xValue),
          stdRestCd: stdRestCd,
        };
      });
    },
    async GET_locationInfo(stdRestNm, stdRestCd) {
      this.isLoadingRestDetail = true;
      this.restDetail = {};
      const restConvList = await useApiReq(`/restinfo/restConvList?key=${APIKEY}&type=json&numOfRows=10&pageNo=1&stdRestCd=${stdRestCd}`);
      const restBestfoodList = await useApiReq(`restinfo/restBestfoodList?key=${APIKEY}&type=json&numOfRows=10&pageNo=1&stdRestCd=${stdRestCd}`);
      const restBrandList = await useApiReq(`/restinfo/restBrandList?key=${APIKEY}&type=json&numOfRows=10&pageNo=1&stdRestCd=${stdRestCd}`);

      let svarAddr = '';

      if (restConvList.data._rawValue.list.length > 0 && restConvList.data._rawValue.list[0].svarAddr) {
        svarAddr = restConvList.data._rawValue.list[0].svarAddr;
      } else if (restBrandList.data._rawValue.list.length > 0 && restBrandList.data._rawValue.list[0].svarAddr) {
        svarAddr = restBrandList.data._rawValue.list[0].svarAddr;
      } else if (restBestfoodList.data._rawValue.list.length > 0 && restBestfoodList.data._rawValue.list[0].svarAddr) {
        svarAddr = restBestfoodList.data._rawValue.list[0].svarAddr;
      }

      this.restDetail = {
        stdRestNm: stdRestNm,
        conv: restConvList.data._rawValue.list,
        brand: restBrandList.data._rawValue.list,
        food: restBestfoodList.data._rawValue.list,
        svarAddr,
      };
      if (this.restDetail.conv.length === 0 && this.restDetail.brand.length === 0 && this.restDetail.food.length === 0) {
        this.restDetail = { stdRestNm: stdRestNm, svarAddr };
      }
      this.isLoadingRestDetail = false;
    },
    REMOVE_locationInfo() {
      this.restDetail = null;
    },
  },
});
