<template>
  <div class="wrapper">
    <nav-header></nav-header>
    <nav-breader1>
      <p slot="title">我的收货地址</p>
    </nav-breader1>
    <el-container>
      <el-main>
        <step :active="1"></step>
        
        <el-card class="box-card address-card" 
         v-for="(item,index) in addressListFilter" :key="index">
          <div class="addressInfo">
            <p>收件人:{{item.userName}}</p>
            <p>收货地址:{{item.streetName}}</p>
            <p>邮编:{{item.postCode}}</p>
            <p>联系电话:{{item.tel}}</p>
          </div>
          <div class="favorite">
            <p><i class="el-icon-star-on" @click="setDefalutAddress(item.addressId)" v-bind:class="{'love':item.isDefault==true}"></i></p>
            <p><i class="el-icon-delete" @click="confirmDel(item.addressId)"></i></p>
          </div>

        </el-card>

        <el-card class="box-card address-card">
          <div class="add-address">
            <i class="el-icon-plus"  @click="addressdialogVisible = true"></i>
            <p>添加新地址</p>
            
           </div>
        </el-card>
      </el-main>
      <el-footer>
        <el-row class="loadmore">
          <span @click="loadmore()">{{tip}}</span>
          <i class="el-icon-arrow-down" @click="loadmore()" v-bind:class="{'cur':this.limit!==3}"  ></i>
        </el-row>
        <!-- 导航到下一步 -->
        <el-row class='routeGuide'>
          <router-link to="/cart">
            <el-button type="success" class="pre" >上一步</el-button>
          </router-link>
          
          <router-link :to="{path:'/orderConfirm',query:{'addressId':selectAddressId}}">
            <el-button type="success" class="next">下一步</el-button>
          </router-link>    
        </el-row>
      </el-footer>
    </el-container>
    <!-- 删除地址弹窗 -->
    <el-dialog
      title=""
      :visible.sync="addressRemovedialog"
      width="30%"
      center>
      <span class="cartTip"><i class="el-icon-info"></i>您是否确认要删除此地址?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressRemovedialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加收货地址弹窗 -->
    <el-dialog
      title="添加收货地址"
      :visible.sync="addressdialogVisible"
      width="40%" center>
      <div class="form">
        <el-form ref="formAddAddress" :model="formAddAddress"  label-width="90px" :rules="rules"  :label-position="labelPosition" >
          <el-form-item label="收货人:" prop="name">
            <el-input v-model="formAddAddress.name" placeholder="Name"></el-input>
          </el-form-item>
          <el-form-item label="收货地址:" prop="address">
            <el-input v-model="formAddAddress.address" placeholder="Address"></el-input>
          </el-form-item>
          <el-form-item label="邮编:" prop="postMail">
            <el-input type="postMail" v-model.number="formAddAddress.postMail" placeholder="AddressMail" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话:" prop="telNum">
            <el-input type="telNum" v-model.number="formAddAddress.telNum" placeholder="Tel" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddressForm('formAddAddress')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
          title=""
          :visible.sync="longinTip"
          width="30%"
          center
        >
          <span class="cartTip">购物车地址至少有一个！</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="longinTip = false" type="danger" style="width:120px">关闭</el-button>   
          </span>
        </el-dialog>
  </div>
</template>

<script>
import NavHeader from './../components/NavHeader'
import NavBreader1 from './../components/NavBreader1'
import Step from './../components/Step'
import {currency} from '@/util/currency.js'
import { mapMutations } from 'vuex'
export default {
  name:'Address',
  components:{
    NavHeader,
    NavBreader1,
    Step,
    
  },
  props:{},
  data(){
    return {
      addressList:[],
      limit:3,
      tip:'加载更多',
      addressId:'',
      selectAddressId:'',
      addressdialogVisible:false,
      addressRemovedialog:false,
      longinTip:false,
      labelPosition:'left',
      show:false,
      formAddAddress:{
        name:'',
        address:'',
        postMail:'',
        telNum:''
      },
      rules: {
        name: [
          { required: true, message: '请填写收货人姓名' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符' }
        ],
        address:[
          { required: true, message: '请填写收货人地址' },
        ],
        postMail:[
          { required: true, message: '邮编不能为空'},
          { type: 'number', message: '邮编必须为数字值'}
        ],
        telNum:[
          { required: true, message: '电话不能为空'},
          { type: 'number', message: '电话号码必须为数字值'},
        ]
      }    
    }
  },
  watch:{},
  computed:{
    addressListFilter(){
        return this.addressList.slice(0,this.limit);
     }
  },
  methods:{
    loadmore(){
      this.limit=this.limit == 3?this.addressList.length:3;
      this.tip=this.limit == 3?'加载更多':'收起';
      // if(this.addressList.length<3){
      //   this.tip='收起'
      // }
    },
    confirmDel(addressId){
      if(this.addressListFilter.length<=1){
        this.longinTip=true;
        return 
      }
      this.addressRemovedialog = true;
      this.addressId=addressId;
    },
    deleteAddress(){
      this.addressRemovedialog = false;
      this.axios.post('users/addressDel',{addressId:this.addressId}).then((res)=>{
        res = res.data;
        if(res.code === 0){
          this.getAddressList()
        }
        // console.log(res);
        
      })
    },
    setDefalutAddress(addressId){
      this.addressId=addressId;
      this.axios.post('users/setDefalutAddress',{addressId:this.addressId}).then((res)=>{
        res = res.data;
        if(res.code === 0){
          this.getAddressList()
        }
      })
    },
    submitAddressForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addressdialogVisible = false;
          let adrId = parseInt(Math.random()*1000)*1000+parseInt(Math.random()*1000);   
          this.axios.post('users/addAddress',{
            addressId: adrId,
            postCode: this.formAddAddress.postMail,
            streetName: this.formAddAddress.address,
            tel: this.formAddAddress.telNum,
            userName: this.formAddAddress.name,
            isDefault : false 
          }).then((res)=>{
            res=res.data;
            if(res.code==0){
              this.getAddressList();
            }
          })
          
        } else {
          alert('error submit!!');
          return false;
        }
      });
    },
    getAddressList(){
      this.axios.get('/users/addressList').then((res)=>{
        res = res.data;
        if(res.code === 0){
          this.addressList=res.result;
          //确认被选中的addressId,向一个页面传入addressId
          this.addressList.forEach((item)=>{
            if(item.isDefault){
              this.selectAddressId = item.addressId;
            }
          })
                 
        }
       
        
      })
    }
    
  },
  created(){},
  mounted(){
    this.getAddressList()
  }
}
</script>
<style lang="stylus" scoped>
.wrapper{
  .cartTip{
    font-size:18px;
    text-align:center;
    i{
      font-size:22px;
      color:#ccc;
      margin-right:10px;
    }
  }
  .el-footer{
    .loadmore{
      text-align :center;
      color :#67C23A;
      margin-top : 10px;
      font-size:20px;
      cursor:pointer;
      .cur{
        transform:rotate(180deg); 
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
  .address-card{
    position:relative
    float:left;
    width 300px
    height 250px
    margin-right:20px;
    margin-top:20px;
    font-size:20px;
    .addressInfo{
      font-size:18px;
    }
    .favorite{
      width 80%;
      position:absolute;
      bottom:0;
      display:flex;
      justify-content :space-between;
      font-size:32px;
      .el-icon-delete{
        font-size:28px;
        color:#ff6666;
        &:hover{
          color:red;
          cursor:pointer;
          transform:scale(1.5)
          transition:all .3s linear;
        }
      }
      .love{
        color:#F56C6C;
      }
    }
    .add-address{
      margin-top:40px;
      text-align :center;
      .el-icon-plus{
        font-size 50px;
        color :#409EFF;
      }
      
    }
  }
}
</style>