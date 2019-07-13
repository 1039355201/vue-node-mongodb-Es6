<template>
  <div class="header-wrapper">
    <div class="left">
      <div class="img-wrapper">
        <img src="./../assets/homeHeader.jpg" v-bind:class="{'rotate':flag}">
      </div>
    </div>
    <div class="middle">糖炒栗子网上商城</div>
    <div class="right">
      <span  v-if="statuscode" class="welcome userName">{{userName}}</span>
      <span  v-if="statuscode" class="iconfont icon-dingbudaohang-zhangh welcome" @click="toLoginOut()"></span>
      <span  v-if="statuscode" class="iconfont iconToCart el-icon-shopping-cart-2 welcome" @click="toCart()"><span class="cartNum">{{cartCount}}</span></span>

      <span v-if="!statuscode" class="iconfont icon-dengluzhuce welcome" @click="toLogin()"></span>

    </div>
    <!-- <transition name="login">
      <router-view></router-view>
    </transition> -->

  </div>
</template>

<script>
import  {mapMutations} from 'vuex'
import  {mapState} from 'vuex'
export default {
  name:'NavHeader',
  components:{},
  props:{},
  data(){
    return {
      count:0,
      flag:false,
      userName:'',
    }
  },
  watch:{},
  computed:{
    ...mapState({
      statuscode:'statuscode',
      cartCount:'cartCount'
    })
    
  },
  methods:{
    ...mapMutations({
      toggleLogin:'isLogin',
      getCartNum:'cartNum',
      initNum:'init'
    }),

    toLogin(){
      this.$router.push({
        path:'/login'
      })     
    },
    toLoginOut(){
      // 0 代表退出登录; 1 代表登录成功
      this.toggleLogin(0);
      this.axios.get('users/loginout').then((res)=>{
        if(res.status=200){
          res=res.data;//data: {code: 0, msg: "当期已登录!"}
          if(res.code===0){
            // console.log(res.msg);
          }
        }
        
        
      })
    },
    checkLogin(){
      this.axios.get('users/checkLogin').then((res)=>{
        if(res.status=200){
          res=res.data;//data: {code: 0, msg: "当期已登录!"}
          if(res.code===0){
            this.toggleLogin(1);
            this.userName=res.result;
          }
        }
        // console.log(res);
        
      })
    },
    getCartCount(){
       this.axios.get('users/cartList').then((res)=>{
         res=res.data;
         if(res.code==0&& res.result){
           
           res=res.result.cartList;
           res.forEach((item)=>{
             this.count += item.productNum
           })
           this.initNum(this.count) 
         }
        //  console.log(res,this.count);
         
       })   
    },
    toCart(){
      this.$router.push('/cart')
    }
  },
  created(){},
  mounted(){
    this.flag=true;
    this.checkLogin();
    this.getCartCount()
  }
}
</script>
<style lang="stylus" scoped>
// .login-enter-active,.login-leave-active{
//   transition:all 100s ease
// }
// .login-enter,.login-leave-to{
//   transform :translateX(100vw);
//   opacity :0
// }
  .header-wrapper{
    display:grid;
    grid-template-rows :100px;
    grid-template-columns :200px auto 300px;
    line-height:100px;
    overflow:hidden
    .left{
      .img-wrapper{
        margin:0 auto;
        width:100%;
        height:80px;
        // border-radius :50%;
        position: relative;
        img{
          width:80px;
          height:100%;
          border-radius :50%;
          position: absolute;
          top:10px;
          left:20px;
          &:hover{
            animation: img2 2s both 0.3s linear 5;
            cursor pointer
          }  
        }
        @keyframes img2 {
           0% {transform: scale(1);}
				50% {transform:  scale(1.2);}
				80% {transform: scale(1.1);}
				100% {transform: scale(1);}
        
      } 
      }
  .rotate{
    animation: img1 2s both 0.3s linear 2 ;
  }  
  @keyframes img1 {
        //   0% {transform: rotate(0 deg);}
				// 50% {transform:  rotate(160 deg);}
				// 80% {transform: rotate(270 deg)}
				// 100% {transform: rotate(360 deg);}
          0% {left:20px;}
				50% {left:80%;transform:  rotateY(90 deg);}
				80% {left:80%;transform: rotateY(0 deg)}
				100% {left:20px;}
        
      } 
     
      
    }
    .middle{
      text-align:center;
      font-size:36px;
      font-weight:bold;
      letter-spacing :5px;
      color:#666;
      font-family:YouYuan;
    }
    .right{
     
      text-align:center;
      // width:200px;
      .welcome{
        font-size:32px;
        color:#f00;
        margin-right:10px;
      }
      .userName{
        font-size:20px;
      }
      .iconToCart{
         position :relative;
      }
      .cartNum{
        position :absolute;
        top:-20%;
        left:55%;
        background-color :#f9013d;
        width 20px
        height 20px
        line-height :20px;
        border-radius:50%;
        font-size:14px;
        text-align:center;
        color:#fff;
      }
    }
  }
</style>