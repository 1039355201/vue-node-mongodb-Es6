<template>
  <div class="wrapper">
    <nav-header></nav-header>
    <nav-breader @searchGoods="searchGoods"></nav-breader>
    <div class="main">
       <!-- <nav-footer></nav-footer>   -->
      <!-- 价格排序 -->
      <div class="price-sort">
        sort by:
        <span class="default">default</span>
        <span class="price" @click="priceAndSort()">price<span class="iconfont icon-zuo iconfont_price" v-show="priceSort"   ></span></span>
        <span class="iconfont icon-arrow2 iconfont_price" v-show="!priceSort"></span>
      </div>
      <!-- 中间板块（左：价格过滤） （右：商品板块） -->
      <div class="main-wrapper">
        <!-- 价格过滤 -->
        <div class="price">
          <dl class="price-filter">
            <dt class="origin-title">PRICE:</dt>
            <dd><a href="javascript:void(0)" class="origin" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
            <dd v-for="(item,index) in priceFilter" :key="index" >
              <a href="javascript:void(0)" class="origin" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}" >{{item.startPrice}} - {{item.endPrice}}</a>
            </dd>
          </dl>        
        </div>
        <!-- 商品 -->
        <div class="goodsListWrapper">
          <ul class="goodsList">
            <li class="good" v-for="(item,index) in goodsList" :key="index">
              <div class="goodWrapper">
                 <div class="image-wrapper">
                <img v-lazy='"static/image/"+item.productImage' :key='"static/image/"+item.productImage' alt="" srcset="">
              </div>
              <p class="goodName">{{item.productName}}</p>
              <p class="goodPrice">￥{{item.salePrice}}</p>
              <a class="addCart" @click="addCart(item.productId)">加入购物车</a>
              </div>
            </li>
          </ul>
          <div 
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="20"
                    style="text-align: center; margin-bottom: 5px;">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
          </div>
        </div>
      </div>
      

    </div>
    <!-- 购物车弹窗 -->
        <el-dialog
          title=""
          :visible.sync="dialogVisible"
          width="30%"
          center
        >
          <span class="cartTip"><i class="el-icon-circle-check"></i>加入购物车成功!</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">继续添加</el-button>
            <router-link to="/cart">
              <el-button type="danger" @click="dialogVisible = false">查看购物车</el-button>
            </router-link>
          </span>
        </el-dialog>
      <!-- 设置登录拦截  -->

      <!-- 购物车弹窗 -->
        <el-dialog
          title=""
          :visible.sync="longinTip"
          width="30%"
          center
        >
          <span class="cartTip">请先登陆,否则无法加入购物车！</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="longinTip = false" type="danger" style="width:120px">关闭</el-button>   
          </span>
        </el-dialog>
     
  </div>
</template>

<script>
import NavHeader from './../components/NavHeader'
import NavBreader from './../components/NavBreader'
import NavFooter from './../components/NavFooter'
import {mapMutations} from 'vuex'
export default {
  name:'GoodsList',
  components:{
    NavHeader,
    NavBreader,
    NavFooter
  },
  props:{},
  data(){
    return {
      rotate:false,
      goodsList:[],
      searchAllList:[],
      sort:1,
      pageSize:8,
      page:0,
      loading :true,
      busy:true,
      priceChecked:'all' ,
      priceSort:true,
      dialogVisible: false,
      longinTip: false,
      priceFilter:[
                  {
                      startPrice:'0.00',
                      endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                  }
                ],
    
    }
  },
  watch:{},
  computed:{},
  methods:{
    ...mapMutations({cartNum:'cartNum'}),
    addCart(productId){
      
      this.axios.post('/goods/addCart',{productId:productId}).then((res)=>{
        res=res.data;
        if(res.code===0){
          this.dialogVisible=true;
          this.cartNum(1);  
        }else if(res.code===3){
          
          this.longinTip=true;
          
        }else{
          this.$message({
            showClose: true,
            message: '服务器繁忙,请您稍后重试!'
          });
        }
      }) 
    },
    priceAndSort(){
      this.rotate=true;
      this.priceSort=!this.priceSort;
      this.sort=this.priceSort?1:-1;
      this.page = 0 ;
      this.loading=true;
      this.goodsList=[];
      this.getGoodsList();
    },
    setPriceFilter(index){
      this.priceChecked=index;
      this.page=0;
      this.loading = false;
      // this.goodsList=[];
      this.getGoodsList();
    },
    loadMore(){
            // disabled true 取消懒加载
       this.busy = true;
               setTimeout(() => {
                this.page++;
                this.getGoodsList(true);
              }, 2000);
        },
    getGoodsList(flag){
      let param = {
           page:this.page,
           pageSize : this.pageSize,
           sort : this.sort,
           priceChecked : this.priceChecked
      }
      this.axios.get('/goods/list',{params:param}).then((res)=>{
      
         res=res.data;
        //  console.log(res);
        if(res && res.ret==1){   
          // 第二次加载
          if(flag){
            if(res.data.length==0){
              this.busy=true;
            }else if(res.data.length<8){
              this.loading=false;
            }
           
            this.goodsList=this.goodsList.concat(res.data);
            this.searchAllList=this.goodsList.concat(res.data);
            this.busy=false;
          }else{
            this.goodsList=res.data;
            this.busy=false;
            // console.log(res,this.goodsList);
          }   
        }
        
       
        
      })
    },
    searchGoods(productName){
      console.log(this.searchAllList);
      
      var res=[];
      res=this.searchAllList.filter((item)=> item.productName.indexOf(productName)!==-1)
      if(res.length){
        this.goodsList=res;
        this.loading=false;
        // setTimeout(() => {
        //   this.getGoodsList();
        // }, 1000);
      }else{
        this.$message({
          message: '商品不存在!',
          type: 'warning'
        })
        // this.goodsList=this.searchList;
      }
      console.log(res);
    }
  },
  created(){},
  mounted(){
    this.getGoodsList();
  }
}
</script>
<style lang="stylus" scoped>
.wrapper{
  .cartTip{
    font-size:22px;
    text-align:center;
    i{
      font-size:22px;
      color:#f00;
      margin-right:10px;
    }
  }
  .main{
    position:relative;
    
    .price-sort{
      position:relative;
      left:80%;
      margin: 20px 0;
      font-size:24px;
      .default{
        color:#ff7b7b;
        margin:0 15px;
      }
      .price{
        &:hover{
          color:#f00;
          cursor:pointer ;
          
        }
        .iconfont_price{
          font-size:20px;
          transition:all 0.3s ease-out
        }
        
      }
      .priceIconRotate{
          transform:rotate(180 deg);
          transition:all 0.3s ease-out
        } 
      
    }
    
    .main-wrapper{
      display:flex;

      .price{
        width:300px;
        .price-filter{
        width:100%;
        padding-left:50px;
        padding-top:50px;
        .origin-title{
          font-weight :bold;
          margin-bottom :5px;
        }
        .origin{
          text-decoration:none;
          height:40px;
          line-height:40px;
          color:#000;
          font-size:16px;
        }
        .cur{
          color: #d1434a;
          border-left:2px solid #d1434a;
          padding-left:20px;
          transition:all .3s linear
        }
        
      }
      }
      
      .goodsListWrapper{
        flex:1;
        .goodsList{
          display:flex;
          flex-wrap :wrap;
          .good{
            width:25%;
            list-style-type:none;
            font-size:18px;
            .goodWrapper{
              display:flex;
              flex-direction:column;
              justify-content:center;
              align-items:center;
              &:hover{
                border:2px solid #f00;
                background-color :#fff;
                cursor: pointer;
                transition :all .2s linear,border 0s linear;
              }
              .image-wrapper{
                width: 100%
                text-align:center
                img{
                  width: 60%
                }
              }
              .goodPrice{
                margin:5px 0;
                &:hover{
                  color:#f00;
                }
              }
              .addCart{
                display:block;
                width 120px
                height 40px
                line-height 40px;
                margin-bottom :10px;
                text-align:center;
                text-decoration:none;
                color:#007bff;
                &:hover{
                  border:1px solid #fff;
                  color:#fff;
                  border-radius:5px;
                  background-color :#ff7b7b;
                  transition :all .3s linear;
                }
            } 
            }
           
            
               
          }
        }
        
      }
    }
  }
}
</style>