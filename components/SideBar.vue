<template>
  <aside v-if="locationInfoRest.getRestDetail">
    <q-card class="aside_inner q-pb-lg" style="overflow: hidden">
      <div v-if="locationInfoRest.getIsLoadingRestDetail">
        <div class="flex justify-between q-mb-md q-px-md q-py-sm" style="background: #258fff; color: #fff">
          <q-skeleton width="250px" height="50px" />
          <q-icon color="#70757a" class="q-pa-sm" size="sm" name="close" @click="close" />
        </div>
        <div class="q-px-md">
          <q-skeleton width="200px" class="q-mb-sm" />
          <q-skeleton width="300px" class="q-mb-sm" />
        </div>
        <q-separator spaced inset />
        <div class="q-px-md">
          <q-skeleton width="200px" class="q-mb-sm" />
          <q-skeleton width="300px" class="q-mb-sm" />
          <q-skeleton width="350px" height="100px" />
        </div>
      </div>

      <div v-else>
        <div class="flex justify-between q-mb-md q-px-md q-py-sm" style="background: #258fff; color: #fff">
          <q-toolbar-title style="line-height: 40px">{{ locationInfoRest.getRestDetail.stdRestNm }}</q-toolbar-title>
          <q-icon color="#70757a" class="q-pa-sm" size="sm" name="close" @click="close" />
        </div>
        <div v-if="!locationInfoRest.getRestDetail.conv" class="q-mx-md">정보가 없습니다.</div>
        <div v-else class="content">
          <div v-if="locationInfoRest.getRestDetail.svarAddr" class="q-px-md" style="color: #888; font-size: 12px">
            <q-icon size="18px" style="margin-right: 5px" name="room" />
            <span>{{ locationInfoRest.getRestDetail.svarAddr }}</span>
          </div>
          <div v-if="locationInfoRest.getRestDetail.gudClssNm" class="q-px-md q-mt-sm" style="color: #333; font-size: 12px">
            <q-icon size="18px" style="margin-right: 5px" name="import_export" />
            <span>방향 : </span>
            <span>{{ locationInfoRest.getRestDetail.gudClssNm }}</span>
          </div>
          <div v-if="locationInfoRest.getRestDetail.conv.length > 0" class="q-px-md q-my-sm" style="color: #333; font-size: 12px">
            <q-icon size="18px" style="margin-right: 5px" name="info" />
            <span>편의시설 : </span>
            <span v-for="{ psName, redId } in locationInfoRest.getRestDetail.conv" :key="redId">{{ psName }}, </span>
          </div>
          <TabPanels :tab-menu="tabMenu">
            <q-tab-panel name="음식">
              <div v-if="locationInfoRest.getRestDetail.brand.length === 0 && locationInfoRest.getRestDetail.food.length === 0">데이터가 없습니다.</div>
              <div v-else>
                <q-list>
                  <h2 v-if="locationInfoRest.getRestDetail.brand.length > 0" class="q-mx-md" style="margin-top: 20px; margin-bottom: 10px; font-size: 22px; font-weight: bold">체인점</h2>
                  <q-item v-for="{ brdName, brdDesc, stime, etime, redId } in locationInfoRest.getRestDetail.brand" :key="redId">
                    <q-item-section>
                      <q-item-label>{{ brdName }}</q-item-label>
                      <q-item-label caption lines="3">{{ brdDesc }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-if="stime" side top>
                      <q-item-label caption>{{ `${stime}~${etime}` }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator v-if="locationInfoRest.getRestDetail.food.length > 0" spaced inset />
                  <h2 v-if="locationInfoRest.getRestDetail.food.length > 0" class="q-mx-md" style="margin-top: 20px; margin-bottom: 10px; font-size: 22px; font-weight: bold">음식</h2>
                  <q-item v-for="{ foodNm, redId } in locationInfoRest.getRestDetail.food" :key="redId">
                    <q-item-section>
                      <q-item-label>{{ foodNm }}</q-item-label>
                    </q-item-section>
                    <q-separator spaced inset />
                  </q-item>
                </q-list>
              </div>
            </q-tab-panel>
            <q-tab-panel name="주유소">
              <div v-if="locationInfoRest.getRestDetail.gasStation.length === 0 && locationInfoRest.getRestDetail.gasPrice.length === 0">데이터가 없습니다.</div>
              <div v-else>
                <div v-if="locationInfoRest.getRestDetail.gasPrice">
                  <h2 class="q-mx-md" style="margin-top: 20px; margin-bottom: 10px; font-size: 22px; font-weight: bold">주유소 가격</h2>
                  <q-table flat bordered hide-bottom dense separator="vertical" :rows="locationInfoRest?.getRestDetail.gasPrice" :columns="columns" row-key="name" />
                </div>
                <div v-if="locationInfoRest.getRestDetail.gasStation">
                  <h2 class="q-mx-md" style="margin-top: 20px; margin-bottom: 10px; font-size: 22px; font-weight: bold">
                    {{ locationInfoRest.getRestDetail.gasStation[0].stdRestNm }}
                  </h2>
                  <q-item v-for="{ psName, psDesc, stime, etime, redId } in locationInfoRest.getRestDetail.gasStation" :key="redId">
                    <q-item-section>
                      <q-item-label>{{ psName }}</q-item-label>
                      <q-item-label caption lines="3">{{ psDesc }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-if="stime" side top>
                      <q-item-label caption>{{ `${stime}~${etime}` }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="주차공간">
              <div v-if="locationInfoRest.getRestDetail.hiwaySvarInfoList.length === 0">데이터가 없습니다.</div>
              <div v-else>
                <h2 class="q-mx-md" style="margin-top: 20px; margin-bottom: 10px; font-size: 22px; font-weight: bold">주차 공간</h2>
                <q-table flat bordered hide-bottom dense separator="vertical" :rows="locationInfoRest?.getRestDetail.hiwaySvarInfoList" :columns="columnsPrkg" row-key="name" />
              </div>
            </q-tab-panel>
          </TabPanels>
        </div>
      </div>
    </q-card>
  </aside>
</template>

<script setup>
import { useLocationinfoRest } from '~/stores/locationinfoRest';
const locationInfoRest = useLocationinfoRest();
const tabMenu = ['음식', '주유소', '주차공간'];
const columns = [
  {
    name: 'gasolinePrice',
    field: 'gasolinePrice',
    label: '휘발유',
    align: 'center',
  },
  {
    name: 'diselPrice',
    field: 'diselPrice',
    label: '경유',
    align: 'center',
  },
  {
    name: 'lpgPrice',
    field: 'lpgPrice',
    label: 'LPG',
    align: 'center',
  },
];
const columnsPrkg = [
  {
    name: 'cocrPrkgTrcn',
    field: 'cocrPrkgTrcn',
    label: '소형차주차대수',
    align: 'center',
  },
  {
    name: 'fscarPrkgTrcn',
    field: 'fscarPrkgTrcn',
    label: '대형차주차대수',
    align: 'center',
  },
  {
    name: 'dspnPrkgTrcn',
    field: 'dspnPrkgTrcn',
    label: '장애인주차대수',
    align: 'center',
  },
];

const close = () => {
  locationInfoRest.REMOVE_locationInfo();
};
</script>

<style lang="scss" scoped>
aside {
  padding: 10px 0;
  width: 400px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  transition: 0.5s transform;
  visibility: visible;
  opacity: 1;
  max-height: 100vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0px;
  }

  &.side_hidden {
    visibility: hidden;
    opacity: 0;
  }
  .aside_inner {
    margin: auto;
    background: #fff;
    width: 380px;
  }
  .show_btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -19px;
    background: #3396ff;
    text-align: center;
    height: 60px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: 0.5s;
    border: none;
    width: 18px;
    padding: 0;
    &:hover {
      background: #48a1ff;
    }
    span {
      width: 10px;
      margin: 0 7px 0 5px;
    }
  }
}
h1 {
  height: 100px;
  text-align: center;
  line-height: 100px;
}

::v-deep {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #e4f4ff;
  }
}
</style>
