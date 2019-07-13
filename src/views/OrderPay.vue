<template>
  <div class="wrapper">
    <nav-header></nav-header>
    <nav-breader1>
      <p slot="title">我的订单</p>
    </nav-breader1>
    <el-container>
      <el-header>
        <step :active="3" ></step>
      </el-header>
      <el-main>
        <el-row type="flex"  justify="space-around">
          <el-col :span="6" >
              <img src="/static/mallimg/zhifubao.png" alt="" srcset="">
          </el-col>
          <el-col :span="6">
              <img src="/static/mallimg/weixin.png" alt="" srcset="">        
          </el-col>
        </el-row>
        <el-row type="flex"  justify="space-around">
          <el-col :span="8" >
            <span class="orderId">订单号:{{orderId}}</span>
          </el-col>
          <el-col :span="8" >
            <span class="orderId">订单金额:{{orderTotal}}</span>
          </el-col>    
        </el-row>
         <!-- 导航到下一步 -->
        <el-row class='routeGuide'>

          <router-link to="/orderConfirm">
             <el-button type="success" class="pre" >上一步</el-button>
          </router-link>

          <router-link v-bind:to="{path:'/orderSuccess',query:{'orderId':orderId}}">
            <el-button type="success" class="next" >下一步</el-button>
          </router-link>  
        
        </el-row>
      </el-main>
    </el-container>   
  </div>
</template>

<script>
import NavHeader from './../components/NavHeader'
import NavBreader1 from './../components/NavBreader1'
import Step from './../components/Step'
import {currency} from '@/util/currency.js'
import { mapMutations } from 'vuex'
export default {
  name:'OrderPay',
  components:{
    NavHeader,
    NavBreader1,
    Step,
  },
  props:{},
  data(){
    return {
      orderId:'',
      orderTotal:''
    }
  },
  watch:{},
  computed:{},
  methods:{
    getOrder(){
      this.orderId=this.$route.query.orderId;
      this.axios.get('/users/orderPay',{
        params:{
          orderId:this.orderId
        }
        }).then((res)=>{
              res = res.data;
              if(res.code==0){
                this.orderTotal=res.result;
              }
              // console.log(res);
          })
      
      
    }
  },
  created(){},
  mounted(){
    this.getOrder()
  }
}
</script>
<style lang="stylus" scoped>
.wrapper{
  .el-main{
    .el-row{
      &:nth-of-type(1){
        margin-top:40px;
      }
      &:nth-of-type(2){
        margin-top:40px;
        text-align :center;
      }
      .orderId{
        font-size:20px;
        color:#F56C6C;
        
      }
      
    }
    .routeGuide{
        height 55px;
        line-height 55px;
        background-color :#6A7584
        padding:0 10px;
        position relative
        .pre{
          position :absolute
          top:6px;
          left:10px;
        }
        .next{
          position :absolute
          top:6px;
          right:10px;
        }
      }
  }
}
</style>