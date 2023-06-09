import { defineStore } from 'pinia';
import useApiReq from '~/composables/useApiReq';

const APIKEY = '0641899320';
export const useLocationinfoRest = defineStore('locationinfoRest', {
  state: () => ({
    locationinfoRest: [],
    locationinfoRestUp: [], // 상향
    locationinfoRestDown: [], // 하향
    restDetail: null,
    isLoadingRestDetail: false,
  }),
  getters: {
    getLocationinfoRest: (state) => state.locationinfoRest,
    getLocationinfoRestUp: (state) => state.locationinfoRestUp,
    getLocationinfoRestDown: (state) => state.locationinfoRestDown,
    getRestDetail: (state) => state.restDetail,
    getIsLoadingRestDetail: (state) => state.isLoadingRestDetail,
  },
  actions: {
    async GET_LocationinfoRest() {
      const data1 = await useApiReq(`/locationinfo/locationinfoRest?key=${APIKEY}&type=json&numOfRows=99&pageNo=1`);
      const data2 = await useApiReq(`/locationinfo/locationinfoRest?key=${APIKEY}&type=json&numOfRows=99&pageNo=2`);
      const data3 = await useApiReq(`/locationinfo/locationinfoRest?key=${APIKEY}&type=json&numOfRows=99&pageNo=3`);
      let hiwaySvarInfoList = await useApiReq(`/restinfo/hiwaySvarInfoList?key=${APIKEY}&type=json&svarGsstClssCd=1`); // 주유소
      const data = [...data1.data._rawValue.list, ...data2.data._rawValue.list, ...data3.data._rawValue.list];

      data.forEach(({ unitName, routeName, xValue, yValue, stdRestCd }) => {
        for (let i = 0; i < hiwaySvarInfoList.length; i++) {
          if (stdRestCd === hiwaySvarInfoList[i].svarCd) {
            this.locationinfoRestUp = [
              ...this.locationinfoRestUp,
              {
                title: unitName,
                text: routeName,
                latlng: new kakao.maps.LatLng(yValue, xValue),
                stdRestCd: stdRestCd,
                gudClssCd: '0',
              },
            ];
            this.locationinfoRestDown = [
              ...this.locationinfoRestDown,
              {
                title: unitName,
                text: routeName,
                latlng: new kakao.maps.LatLng(yValue, xValue),
                stdRestCd: stdRestCd,
                gudClssCd: '1',
              },
            ];
            hiwaySvarInfoList.splice(i, 1);
            break;
          }
        }
      });

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
    async GET_locationInfo(item) {
      const { title, stdRestCd } = item;
      let gasRestCd = '' + (Number(stdRestCd) + 1);
      while (gasRestCd.length !== 6) {
        gasRestCd = '0' + gasRestCd;
      }
      this.isLoadingRestDetail = true;
      this.restDetail = {};
      const restConvList = await useApiReq(`/restinfo/restConvList?key=${APIKEY}&type=json&numOfRows=10&pageNo=1&stdRestCd=${stdRestCd}`);
      const restBestfoodList = await useApiReq(`restinfo/restBestfoodList?key=${APIKEY}&type=json&numOfRows=10&pageNo=1&stdRestCd=${stdRestCd}`);
      const restBrandList = await useApiReq(`/restinfo/restBrandList?key=${APIKEY}&type=json&numOfRows=10&pageNo=1&stdRestCd=${stdRestCd}`);
      const restGasStation = await useApiReq(`/restinfo/restOilList?key=${APIKEY}&type=json&stdRestCd=${gasRestCd}`);
      const hiwaySvarInfoList = await useApiReq(`/restinfo/hiwaySvarInfoList?key=${APIKEY}&type=json&svarCd=${gasRestCd}`);

      let svarAddr = hiwaySvarInfoList.data._rawValue.list[0].svarAddr;

      this.restDetail = {
        stdRestNm: title,
        gudClssNm: hiwaySvarInfoList.data._rawValue.list[0].gudClssNm,
        conv: restConvList.data._rawValue.list,
        brand: restBrandList.data._rawValue.list,
        food: restBestfoodList.data._rawValue.list,
        gasStation: restGasStation.data._rawValue.list,
        svarAddr,
      };
      this.isLoadingRestDetail = false;
    },
    REMOVE_locationInfo() {
      this.restDetail = null;
    },
  },
});
