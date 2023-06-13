import { defineStore } from 'pinia';
import useApiReq from '~/utils/useApiReq';
import useApiEv from '~/utils/useApiEv';

const APIKEY = '0641899320';

export const useLocationinfoRest = defineStore('locationinfoRest', {
  state: () => ({
    locationinfoRest: [],
    elecVehicChargingStarion: [],
    restDetail: null,
    isLoadingRestDetail: false,
    isLoadinghiwaySvarInfoList: false,
    isLoadingElecStation: false,
  }),
  getters: {
    getLocationinfoRest: (state) => state.locationinfoRest,
    getLocationinfoRestUp: (state) => state.locationinfoRest.filter(({ gudClssCd }) => gudClssCd === '0'),
    getLocationinfoRestDown: (state) => state.locationinfoRest.filter(({ gudClssCd }) => gudClssCd === '1'),
    getElecVehicChargingStarion: (state) => state.elecVehicChargingStarion,
    getRestDetail: (state) => state.restDetail,
    // 로딩중
    getIsLoadingRestDetail: (state) => state.isLoadingRestDetail,
    getIsLoadinghiwaySvarInfoList: (state) => state.isLoadinghiwaySvarInfoList,
    getIsLoadingElecStation: (state) => state.isLoadingElecStation,
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
    async GET_hiwaySvarInfoList() {
      this.isLoadinghiwaySvarInfoList = true;
      try {
        const { data } = await useApiReq(`/restinfo/hiwaySvarInfoList?key=${APIKEY}&type=json&svarGsstClssCd=0`);

        let hiwaySvarInfoList = data._rawValue.list;

        this.locationinfoRest = this.locationinfoRest.map(({ title, text, latlng, stdRestCd }) => {
          for (let i = 0; i < hiwaySvarInfoList.length; i++) {
            if (stdRestCd === hiwaySvarInfoList[i].svarCd) {
              return {
                title,
                text,
                latlng,
                stdRestCd,
                gudClssCd: hiwaySvarInfoList[i].gudClssCd,
              };
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
      this.isLoadinghiwaySvarInfoList = false;
    },
    async GET_ElectricVehicleChargingStation() {
      this.isLoadingElecStation = true;
      const formData = new FormData();
      formData.set('orgme', 'Y');
      formData.set('orgetc', 'N');
      try {
        const { data } = await useApiEv('/chlist', {
          method: 'post',
          body: formData,
        });
        let station = {};
        await data._rawValue.chargerList.forEach((item) => {
          const { snm, x, y, ut, po, sid, cst } = item;
          const childData = {
            po,
            cst,
          };
          if (typeof station[sid] === 'undefined') {
            station[sid] = {
              title: snm,
              latlng: new kakao.maps.LatLng(x, y),
              ut,
              state: [childData],
            };
          } else {
            station[sid] = {
              title: snm,
              latlng: new kakao.maps.LatLng(x, y),
              ut,
              state: [...station[sid]?.state, childData],
            };
          }
        });

        let Arr = [];
        for (let objKey in station) {
          Arr = [...Arr, { sid: objKey, ...station[objKey] }];
        }
        this.elecVehicChargingStarion = Arr;
        this.isLoadingElecStation = false;
      } catch (err) {
        console.error(err);
        alert('요청 실패');
      }
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
      const hiwaySvarInfoList = await useApiReq(`/restinfo/hiwaySvarInfoList?key=${APIKEY}&type=json&svarCd=${stdRestCd}`);

      const restGasStation = await useApiReq(`/restinfo/restOilList?key=${APIKEY}&type=json&stdRestCd=${gasRestCd}`);
      const gudClssNm = await useApiReq(`/restinfo/hiwaySvarInfoList?key=${APIKEY}&type=json&svarCd=${gasRestCd}`);
      const curStateStation = await useApiReq(`/business/curStateStation?key=${APIKEY}&type=json&numOfRows=10&pageNo=1&serviceAreaCode2=${gasRestCd}`);

      let svarAddr = gudClssNm.data._rawValue.list[0].svarAddr;

      this.restDetail = {
        stdRestNm: title,
        gudClssNm: hiwaySvarInfoList.data._rawValue.list[0].gudClssNm,
        hiwaySvarInfoList: hiwaySvarInfoList.data._rawValue.list,
        conv: restConvList.data._rawValue.list,
        brand: restBrandList.data._rawValue.list,
        food: restBestfoodList.data._rawValue.list,
        gasStation: restGasStation.data._rawValue.list,
        gasPrice: curStateStation.data._rawValue.list,
        svarAddr,
      };
      this.isLoadingRestDetail = false;
    },
    REMOVE_locationInfo() {
      this.restDetail = null;
    },
  },
});
