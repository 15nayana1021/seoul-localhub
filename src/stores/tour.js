import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTourStore = defineStore('tour', () => {
  const tourData = ref([
    {
      id: 'att1',
      title: '청계천',
      addr1: '서울특별시 종로구 창신동',
      mapx: '127.0097',
      mapy: '37.5714',
      tel: '02-2290-6114',
      category: 'attraction'
    },
    {
      id: 'att2',
      title: '남산서울타워',
      addr1: '서울특별시 용산구 남산공원길 105',
      mapx: '126.9882',
      mapy: '37.5511',
      tel: '02-3455-9277',
      category: 'attraction'
    },
    {
      id: 'att3',
      title: '경복궁',
      addr1: '서울특별시 종로구 사직로 161 (세종로)',
      mapx: '126.9768',
      mapy: '37.5796',
      tel: '02-3700-3900',
      category: 'attraction'
    },
    {
      id: 'att4',
      title: '홍대',
      addr1: '서울특별시 마포구 서교동',
      mapx: '126.9242',
      mapy: '37.5575',
      tel: '02-3153-8114',
      category: 'attraction'
    },
    {
      id: 'att5',
      title: '광화문광장',
      addr1: '서울특별시 종로구 세종대로 172',
      mapx: '126.9768',
      mapy: '37.5724',
      tel: '02-120',
      category: 'attraction'
    },
    {
      id: 'att6',
      title: '여의도한강공원',
      addr1: '서울특별시 영등포구 여의동로 330 (여의도동)',
      mapx: '126.9342',
      mapy: '37.5284',
      tel: '02-3780-0561',
      category: 'attraction'
    },
    {
      id: 'att7',
      title: '광화문',
      addr1: '서울특별시 종로구 사직로 161',
      mapx: '126.9768',
      mapy: '37.5759',
      tel: '02-3700-3900',
      category: 'attraction'
    },
    {
      id: 'att8',
      title: '한강',
      addr1: '서울특별시 성동구 강변북로 257',
      mapx: '127.0204',
      mapy: '37.5385',
      tel: '02-3780-0501',
      category: 'attraction'
    },
    {
      id: 'att9',
      title: '경리단길',
      addr1: '서울특별시 용산구 이태원동',
      mapx: '126.9873',
      mapy: '37.5389',
      tel: '02-749-9114',
      category: 'attraction'
    },
    {
      id: 'att10',
      title: '신사동 가로수길',
      addr1: '서울특별시 강남구 가로수길 23 (신사동)',
      mapx: '127.0232',
      mapy: '37.5204',
      tel: '02-3445-0111',
      category: 'attraction'
    },
    {
      id: 'att11',
      title: '국립중앙박물관 전통염료식물원',
      addr1: '서울특별시 용산구 서빙고로 137 (용산동6가)',
      mapx: '126.9801',
      mapy: '37.5241',
      tel: '02-2077-9000',
      category: 'attraction'
    },
    {
      id: 'cul1',
      title: 'DDP (동대문디자인플라자)',
      addr1: '서울특별시 중구 을지로 281',
      mapx: '127.0098',
      mapy: '37.5665',
      tel: '02-2153-0000',
      category: 'culture'
    },
    {
      id: 'fes1',
      title: '서울세계불꽃축제',
      addr1: '서울특별시 영등포구 여의동로 330',
      mapx: '126.9342',
      mapy: '37.5284',
      tel: '02-510-1114',
      category: 'festival'
    },
    {
      id: 'spo1',
      title: '시그니엘 서울 리트릿 시그니엘 스파',
      addr1: '서울특별시 송파구 올림픽로 300',
      mapx: '127.1025',
      mapy: '37.5125',
      tel: '02-3213-1000',
      category: 'sports'
    },
    {
      id: 'shp1',
      title: '롯데월드타워&롯데월드몰',
      addr1: '서울특별시 송파구 올림픽로 300 (신천동)',
      mapx: '127.1025',
      mapy: '37.5125',
      tel: '02-3213-5000',
      category: 'shopping'
    },
    {
      id: 'acc1',
      title: '서울신라호텔',
      addr1: '서울특별시 중구 동호로 249',
      mapx: '127.0048',
      mapy: '37.5562',
      tel: '02-2233-3131',
      category: 'accommodation'
    }
  ])

  const currentCategory = ref('all')

  const allRawItems = computed(() => tourData.value)

  const currentItems = computed(() => {
    if (currentCategory.value === 'all') {
      return tourData.value
    }
    return tourData.value.filter(item => item.category === currentCategory.value)
  })

  return {
    tourData,
    currentCategory,
    allRawItems,
    currentItems
  }
})