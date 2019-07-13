<template>
  <div class="wrapper">
    <div class="breader">
      <ul class="title">
        <li class="item">小吃美食</li>
        <li class="item">电子商品</li>
        <li class="item">洗护用品</li>
        <li class="item">必备出行</li>
      </ul>
    </div>
    <div class="search">
      <div class="input-wrapper">
        <el-input placeholder="请输入商品名称" v-model="selectGoods" class="input-with-select" @keyup.enter.native="search()">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="商品" value="1"></el-option>
            <el-option label="店铺" disabled value="2"></el-option>
            <el-option label="用户电话"  disabled value="3"></el-option>
          </el-select>
          <el-button slot="append"  icon="el-icon-search" @click="search()"></el-button>
        </el-input>
      </div>
    </div>
    
  </div>
      
</template>

<script>
export default {
  name:'NavBreader',
  components:{},
  props:{},
  data(){
    return {
      selectGoods: '',
      select: ''
    }
  },
  watch:{},
  computed:{},
  methods:{
    search(){
      if(this.selectGoods==''){
        this.$notify({
          title: '消息',
          message: '请输入商品名称!',
          type: 'warning',
          position: 'top-right'
        });
        return
      }
      this.$emit('searchGoods',this.selectGoods);
      setTimeout(() => {
        this.selectGoods=''
      }, 3000);
    }
  },
  created(){},
  mounted(){}
}
</script>
<style lang="stylus" scoped>
  .wrapper{
    display :flex;
    align-items :center;
    background-color :#ff6666;
    .title{
      width:500px;
      position :relative;
      left:30px;
      top:5px;
      overflow:hidden;
      .item{
        float:left;
        width:100px;
        height: 50px;
        line-height: 50px;
        list-style-type :none;
        color:#fff;
        border:1px solid #fff; 
        border-radius :10px; 
        font-size:14px;
        text-align:center; 
        margin-left:20px; 
        box-sizing:border-box
      }
    }
    .search{
      flex:1;
      height 65px
      position:relative;
      .input-wrapper{
        position:absolute;
        left:55%;
        right:10%;
        width 50%
        height 65px
        line-height 65px
        // background-color :#ccc
        border-radius :5px;
        
      }
      .el-select,.el-input {
        width: 120px;      
        font-size:18px
        
      }
      .el-button{
        font-size:24px
       
        
      }
        .input-with-select  {
          background-color: #fff;
          width 80%
        }
    }
  }
</style>