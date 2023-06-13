<template>
  <Layout>
    <div class="main_map">
      <div id="map" ref="map"></div>
    </div>
    <Loading v-if="locationInfoRest.getLocationinfoRestUp.length === 0 && (filter.getFilterDirection === '0' || filter.getFilterDirection === '1')" text="데이터를 불러오는 중 입니다." />
    <Loading v-if="locationInfoRest.getElecVehicChargingStarion.length === 0 && filter.getFilterDirection === '3'" text="전기차 데이터를 불러오는 중 입니다." />
  </Layout>
</template>
<script setup>
import { useLocationinfoRest } from '~/stores/locationinfoRest';
import Layout from '~/layouts/Layout.vue';
import '~/assets/image/down_poi.png';
import '~/assets/image/up_poi.png';
import { useFilter } from '~/stores/Filter';

const locationInfoRest = useLocationinfoRest();
const filter = useFilter();
const level = ref(10),
  map = ref(''),
  selectedMarker = ref(null),
  latitude = ref(37.5176947984203),
  longitude = ref(127.040753546649),
  mapOverlay = ref('');

const fn_clickMap = () => {
  const overlayCard = document.querySelector('#map_overlay_card');
  if (overlayCard) {
    overlayCard.remove();
  }
};

// mapOverlay 생성
const fn_mapOverlay = ({ title, text, latlng }) => {
  mapOverlay.value = '<div id="map_overlay_card">';
  mapOverlay.value += '<div class="overlay_info">';
  mapOverlay.value += `<button type="button"><strong>${title ? title : 'null'}</strong></button>`;
  mapOverlay.value += `<div class="desc">${text ? text : 'null'}</div>`;
  mapOverlay.value += '</div>';
  mapOverlay.value += '</div>';

  const mapCustomOverlay = new kakao.maps.CustomOverlay({
    position: latlng,
    content: mapOverlay.value,
    xAnchor: 0.5, // 커스텀 오버레이의 x축 위치입니다. 1에 가까울수록 왼쪽에 위치합니다. 기본값은 0.5 입니다
    yAnchor: 1.3, // 커스텀 오버레이의 y축 위치입니다. 1에 가까울수록 위쪽에 위치합니다. 기본값은 0.5 입니다
  });
  mapCustomOverlay.setMap(map.value);
};

// 마커클릭
const fn_clickMark = (marker, item) => {
  locationInfoRest.GET_locationInfo(item);
  selectedMarker.value = marker;
  const overlayCard = document.querySelector('#map_overlay_card');
  if (overlayCard) {
    overlayCard.remove();
    fn_mapOverlay(item);
  } else {
    fn_mapOverlay(item);
  }
};

const fn_restPoi = async () => {
  let imageSize = new kakao.maps.Size(24, 35),
    markerImage = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', imageSize),
    poiList = [];

  switch (filter.getFilterDirection) {
    case '0':
      imageSize = new kakao.maps.Size(24, 30);
      markerImage = new kakao.maps.MarkerImage(location.origin + '/_nuxt/assets/image/up_poi.png', imageSize);
      poiList = await locationInfoRest.getLocationinfoRestUp;
      break;
    case '1':
      imageSize = new kakao.maps.Size(24, 30);
      markerImage = new kakao.maps.MarkerImage(location.origin + '/_nuxt/assets/image/down_poi.png', imageSize);
      poiList = await locationInfoRest.getLocationinfoRestDown;
      break;
    case '2':
      poiList = await locationInfoRest.getLocationinfoRest;
      break;
    case '3':
      imageSize = new kakao.maps.Size(24, 30);
      markerImage = new kakao.maps.MarkerImage(location.origin + '/_nuxt/assets/image/elec_poi.png', imageSize);
      poiList = await locationInfoRest.getElecVehicChargingStarion;
      break;
  }

  poiList.forEach((item) => {
    const marker = new kakao.maps.Marker({
      map: map.value, // 마커를 표시할 지도
      position: item.latlng, // 마커를 표시할 위치
      title: item?.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      image: markerImage, // 마커 이미지
    });
    if (filter.getFilterDirection === '3') return;
    kakao.maps.event.addListener(marker, 'click', () => fn_clickMark(marker, item));
  });
};

const kakaoMap = async () => {
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = '';
  const mapOption = {
    center: await new kakao.maps.LatLng(latitude.value, longitude.value),
    level: level.value,
  };
  map.value = await new kakao.maps.Map(mapContainer, mapOption);

  await fn_restPoi();

  kakao.maps.event.addListener(map.value, 'click', fn_clickMap);
};

watch(filter, () => {
  kakaoMap();
});

onMounted(async () => {
  await locationInfoRest.GET_LocationinfoRest();
  await kakaoMap();
  locationInfoRest.GET_hiwaySvarInfoList();
  locationInfoRest.GET_ElectricVehicleChargingStation();
});
</script>
<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100vh;
}
.main_map {
}
</style>
