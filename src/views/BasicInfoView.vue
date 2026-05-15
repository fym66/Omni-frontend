<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'

// 中国各省份城市数据
const chinaData: Record<string, string[]> = {
  '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '大兴区', '昌平区', '顺义区', '房山区', '门头沟区', '怀柔区', '密云区', '平谷区', '延庆区'],
  '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
  '天津市': ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '滨海新区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '宁河区', '静海区', '蓟州区'],
  '重庆市': ['渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '长寿区', '江津区', '合川区', '永川区', '南川区', '璧山区', '铜梁区', '潼南区', '荣昌区', '开州区', '梁平区', '武隆区'],
  '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
  '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
  '福建省': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
  '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
  '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市'],
  '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市'],
  '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市'],
  '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'],
  '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
  '辽宁省': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
  '江西省': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
  '安徽省': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
  '陕西省': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
  '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
  '广西壮族自治区': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
  '云南省': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
  '贵州省': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
  '甘肃省': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
  '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市'],
  '吉林省': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市'],
  '内蒙古自治区': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
  '新疆维吾尔自治区': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区'],
  '西藏自治区': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'],
  '海南省': ['海口市', '三亚市', '三沙市', '儋州市'],
  '台湾省': ['台北市', '高雄市', '台中市', '台南市', '基隆市', '新竹市', '嘉义市'],
  '香港特别行政区': ['香港岛', '九龙', '新界'],
  '澳门特别行政区': ['澳门半岛', '氹仔岛', '路环岛'],
}

type BasicInfoDto = {
  sex: number | null
  birthYear: number | null
  country: string
  province: string
  city: string
}

const form = ref<BasicInfoDto>({
  sex: 0,
  birthYear: 2000,
  country: '中国',
  province: '',
  city: '',
})

const loading = ref(false)
const message = ref('')
const error = ref('')

const basicInfoUrl = 'http://localhost:18281/auth/basic/info'

const provinces = computed(() => Object.keys(chinaData))

const cities = computed(() => {
  if (!form.value.province) return []
  return chinaData[form.value.province] || []
})

const canSubmit = computed(() => {
  return (
    form.value.sex !== null &&
    form.value.birthYear !== null &&
    form.value.country.trim().length > 0 &&
    form.value.province.trim().length > 0 &&
    form.value.city.trim().length > 0
  )
})

function onProvinceChange() {
  form.value.city = ''
}

async function submitBasicInfo() {
  if (!canSubmit.value || loading.value) return

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const response = await axios.post<string>(basicInfoUrl, form.value, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text',
    })

    message.value = response.data || '资料保存成功'
  } catch (requestError) {
    if (axios.isAxiosError<string>(requestError)) {
      error.value = requestError.response?.data || requestError.message || '资料保存失败，请稍后再试'
      return
    }

    error.value = '网络异常，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="basic-info-view">
    <div class="page-heading">
      <div>
        <p>账号资料</p>
        <h1>完善基础信息</h1>
      </div>
    </div>

    <div class="upload-layout">
      <form class="upload-form" @submit.prevent="submitBasicInfo">
        <label>
          <span>性别</span>
          <select v-model.number="form.sex">
            <option :value="0">未知</option>
            <option :value="1">男</option>
            <option :value="2">女</option>
          </select>
        </label>

        <label>
          <span>出生年份</span>
          <input v-model.number="form.birthYear" type="number" min="1900" max="2026" />
        </label>

        <div class="form-grid">
          <label>
            <span>国家</span>
            <select v-model="form.country">
              <option>中国</option>
              <option>美国</option>
              <option>日本</option>
              <option>韩国</option>
              <option>英国</option>
              <option>法国</option>
              <option>德国</option>
              <option>澳大利亚</option>
              <option>加拿大</option>
              <option>其他</option>
            </select>
          </label>

          <label>
            <span>省份</span>
            <select v-model="form.province" @change="onProvinceChange">
              <option value="" disabled>请选择省份</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
          </label>
        </div>

        <label>
          <span>城市</span>
          <select v-model="form.city" :disabled="!form.province">
            <option value="" disabled>{{ form.province ? '请选择城市' : '请先选择省份' }}</option>
            <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>

        <p v-if="message" class="notice success">{{ message }}</p>
        <p v-if="error" class="notice error">{{ error }}</p>

        <button class="primary-action" type="submit" :disabled="!canSubmit || loading">
          {{ loading ? '保存中...' : '保存资料' }}
        </button>
      </form>

      <aside class="upload-preview">
        <div class="preview-cover basic-preview">
          <span>资料</span>
        </div>
        <h2>BasicInfoDto</h2>
        <p>提交字段：sex、birthYear、country、province、city。</p>
        <div class="tag-row">
          <span>{{ form.birthYear }} 年</span>
          <span>{{ form.country }}</span>
          <span>{{ form.province || '省份' }}</span>
          <span>{{ form.city || '城市' }}</span>
        </div>
      </aside>
    </div>
  </section>
</template>