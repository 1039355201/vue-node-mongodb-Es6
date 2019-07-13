<template>
  <div class="wrapper">
    <nav-header></nav-header>
    <nav-breader1>
      <p slot="title">在线支付</p>
    </nav-breader1>
     <el-container>
       <el-header>
         <step :active="2"></step>
       </el-header>
       <el-main>
        
        <div class="cart-wrap">
          
          <el-row class="first-row">
            <el-col :span="9" ><div >商品信息</div></el-col>
            <el-col :span="5" ><div >单价</div></el-col>
            <el-col :span="5" ><div >数量</div></el-col>
            <el-col :span="5" ><div >金额</div></el-col>  
          </el-row>
          
          <el-row class="order-row" v-for="(item,index) in orderList" :key="index">
            <el-col :span="9" class="one-column-content">
              <div class="pic-wrap">
                <img v-bind:src="'./../../static/image/' + item.productImage" alt="" srcset="">
              </div>
              <p class="productName">
                {{item.productName}}
              </p>
            </el-col>
            <el-col :span="5">
              <div class="perPrice">{{item.salePrice | currency('￥')}}</div>
            </el-col>
            <el-col :span="5">
              {{item.productNum}}
            </el-col>
            <el-col :span="5"><div class="subtotal-price" >{{item.productNum*item.salePrice | currency('￥')}}</div></el-col>
            
          </el-row>
          <!-- 结算账单详细 -->
          <el-row class="totalDetail">
            <el-col :span="6" :offset="18">
              <p class="item">运费:{{transportExpense|currency('￥')}}</p>
              <p >折扣:{{discount|currency('￥')}}</p>
              <p >总价:{{totalPrice|currency('￥')}}</p>
            </el-col>
          </el-row>
        </div>
      </el-main>
      <el-footer>
        <!-- 导航到下一步 -->
        <el-row class='routeGuide'>

          <router-link to="/address">
             <el-button type="success" class="pre" >上一步</el-button>
          </router-link>

         <el-button type="success" class="next" @click="payMent">下一步</el-button>
          
        </el-row>
      </el-footer>
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
  name:'OrderConfirm',
  components:{
    NavHeader,
    NavBreader1,
    Step,
  },
  filters:{
    currency:currency
  },
  props:{},
  data(){
    return {
      orderList:[],
      cartList:[],
      transportExpense:50,
      discount: 30,
      totalPrice:0,
    }
  },
  watch:{},
  computed:{},
  methods:{
    payMent(){
      var addressId = this.$route.query.addressId
     
      this. axios.post('/users/payment',{
        addressId:addressId,
        totalPrice:this.totalPrice
      }).then((res)=>{
        res  = res.data;
        if(res.code == 0){
            // console.log(res);
            //alert(11)
            this.$router.push({path:'/orderPay?orderId='+res.result});
        }
      })
    },
    getOrderList(){
      this.axios.get('/users/cartList').then((res)=>{
        res = res.data;
        if(res.code === 0){
          this.cartList=res.result.cartList;
          this.cartList.forEach((item)=>{
            if(item.checked=='1'){
              this.orderList.push(item);
              this.totalPrice +=item.productNum *parseFloat(item.salePrice);
            }
          })
          this.totalPrice=this.totalPrice + this.transportExpense - this.discount
          // console.log(this.cartList,this.orderList);  
        }
        
        
      })
    }
  },
  created(){},
  mounted(){
    this.getOrderList()
  }
}
</script>
<style lang="stylus" scoped>
.wrapper{
  .el-container{
    .el-main { 
      color: #606266;
      text-align: center;     
    }
  }
  .el-footer{
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
  .totalDetail{
    height:150px;
    background-color:white;
    font-size:20px;
    color:#F56C6C;
    .item{
      margin-top:10px;
    }
  }
  .cart-wrap{
      .first-row ,.last-row{
        background: #6a7584;
        font-size: 16px;
        color: white;
        letter-spacing: 5px;
        height: 50px;
        line-height: 50px;
      }
      .last-row{
        letter-spacing: 0;
        font-size:20px;
        height: 80px;
        line-height: 80px;
        .icon-wrap{
          text-align :left;
          padding-left:20px;
          i{
            font-size: 25px;
            margin-right:20px;
            &:hover{
                color: #ee7a23;
            }
          }
          .checkAllFlag,.checked{
            color: #ee7a23;
          }
          .selectAll{
            &:hover{
              color: #ee7a23;
            }
          } 
        }
        .sum{
          color:#CB1313;
          margin-left:10px;
        }
        .countSumBtn{
          background-color :#CB1313
          cursor pointer
        }
        .discheckout{
          background-color :#8A8181
        }
      }
      .order-row{
         background:#fff;
         font-size: 24px; 
         line-height 100px;
         border-bottom :1px solid #eee;
        .one-column-content{
          display:flex;
          justify-content :space-between;
          .icon-wrap{
            height 100px   
            padding-left:10px;
                  i{
                      font-size: 25px;
                          &:hover{
                          color: #ee7a23;
                      }
                  }
          }
          .pic-wrap{
                  flex:1
                  height: 100px;
                  img{
                      height: 100%;
                      width: 40%;
                  }
          }
         
          .productName{
            padding-right:10px;
            font-weight :bold;
          }
        }
        .perPrice{
          color:#606266
        }
        .el-input-number{
          position: relative;
          display: inline-block;
          width: 180px;
          line-height: 38px;
          border: 1px solid #ccc;
           .el-input{
             border: 1px solid #ccc;
           }
            
           .el-input-handle{
             transition: all .3s linear;
             &:hover{
               background-color: #bde6ff;
             }
           }
         }
         .el-icon-delete{
           font-size: 25px;
           &:hover{
               color: #ee0023;
           }
         }
         .subtotal-price{
           color:#CB1313
         }
      }
    }
}
</style>