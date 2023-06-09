<template>
  <Layout>
    <div class="main_map">
      <div id="map" ref="map"></div>
    </div>
  </Layout>
</template>
<script setup>
import { useLocationinfoRest } from '~/stores/locationinfoRest';
import Layout from '~/layouts/Layout.vue';

const locationInfoRest = useLocationinfoRest();
const level = ref(10),
  map = ref(''),
  selectedMarker = ref(null),
  latitude = ref(37.5176947984203),
  longitude = ref(127.040753546649),
  poi = ref([]),
  mapOverlay = ref('');

const fn_clickMap = (mouseEvent) => {
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
  const { title, stdRestCd } = item;
  locationInfoRest.GET_locationInfo(title, stdRestCd);
  selectedMarker.value = marker;
  const overlayCard = document.querySelector('#map_overlay_card');
  if (overlayCard) {
    overlayCard.remove();
    fn_mapOverlay(item);
  } else {
    fn_mapOverlay(item);
  }
};

const fn_poi = () => {
  poi.value.forEach((item) => {
    // 마커 이미지의 이미지 크기 입니다
    const imageSize = new kakao.maps.Size(24, 35);
    // 마커 이미지를 생성합니다
    const markerImage = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', imageSize);
    const marker = new kakao.maps.Marker({
      map: map.value, // 마커를 표시할 지도
      position: item.latlng, // 마커를 표시할 위치
      title: item.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      image: markerImage, // 마커 이미지
    });

    kakao.maps.event.addListener(marker, 'click', () => fn_clickMark(marker, item));
  });
};

const kakaoMap = async () => {
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: await new kakao.maps.LatLng(latitude.value, longitude.value),
    level: level.value,
  };
  map.value = new kakao.maps.Map(mapContainer, mapOption);

  fn_poi();

  kakao.maps.event.addListener(map.value, 'click', fn_clickMap);
};

onMounted(async () => {
  await locationInfoRest.GET_LocationinfoRest();

  poi.value = await locationInfoRest.getLocationinfoRest;
  // [
  //   {
  //     title: 'metarock',
  //     latlng: new kakao.maps.LatLng(37.5176947984203, 127.040753546649),
  //     text: '메타록',
  //   },
  //   {
  //     title: 'test',
  //     latlng: new kakao.maps.LatLng(37.517, 127.04),
  //     text: '테스트 입니다',
  //   },
  // ];
  kakaoMap();
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
