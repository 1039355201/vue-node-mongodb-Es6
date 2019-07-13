<template>
 
  <div class="wrapper">
    <div class="img-wrapper" >
        <img src="@/assets/homeHeader.jpg" alt="" srcset="" v-bind:class="{'rotate':flag==true}">
    </div>
    <div class="from">
      
      <p class="title">用户登录</p>
      <form class="from-content">
        <div class="form-group">
          <label for="exampleInputEmail1">用户名</label>
          <input type="text" class="form-control input_text" id="exampleInputEmail1" placeholder="Email" autofocus v-model="userName">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">密码</label>
          <a class="pull-right" href="">忘记密码？</a>
          <input type="password" class="form-control input_text" id="exampleInputPassword1" placeholder="Password" v-model="userPwd">
        </div>
       
        <div >
          <label class="message">{{message}}</label>
        </div>
        <button type="submit" ref="btn" class="btn btn-success btn-block" >登录</button>
      </form>

      <p class="register">没有账号?<router-link to="/register">点击创建</router-link></p>
    </div>
    
    </div>

</template>

<script>
export default {
  name:'Login',
  components:{},
  props:{},
  data(){
    return {
      message:'请输入用户名和密码!',
      userName:'',
      userPwd:'',
      flag:false,
    }
  },
  watch:{},
  computed:{},
  methods:{
    toLogin(){
      if(!this.userName || !this.userPwd){
        this.message='用户名或密码不能为空!'
        return 0
      }else{
        this.message='';
      }
      this.axios.post('users/login',{
        userName:this.userName,
        userPwd:this.userPwd,
      }).then((res)=>{
          if(res.status==200){
            var res=res.data;

            switch (res.code) {
              case 0:  this.message='密码正确';this.$router.push({path:'/'}); break;
              case 1:  this.message='密码输入错误!';break;
              case 2:  this.message='用户不存在,请注册~';break;
              default: break;
            console.log('防抖成功!');
            
            }
          }
      })
    },
    debounce(fn,wait=50,immediate){
      let timer=null;
      return function(){
        if(immediate){
          fn.apply(this,arguments)
        }
        if(timer){
          clearTimeout(timer);
        }
        timer=setTimeout(() => {
          fn.apply(this,arguments)
        }, wait);
      }
    },
     

  },
  created(){},
  mounted(){
    this.flag=true;
    var btn=this.$refs.btn;
    btn.addEventListener('click',this.debounce(this.toLogin,500),false)
   
  }
}
</script>
<style lang="stylus" scoped>

.wrapper{
  position:relative;
  display:flex;
  justify-content :center;
  align-items :center;
  width:100vw;
  height 100vh;
  .img-wrapper{
      position:absolute;
      top:12%;
      margin:0 auto;
      height: 150px;
      width 150px;
      border-radius :50%;
      overflow:hidden;
      img{
        width:100%;
        &:hover{
          animation: img1 5s both 0.3s linear ;
          cursor pointer
        }
      }
       @keyframes img1 {
         0%{
           transform :rotate(0 deg)
         }
         50%{
           transform :rotate(180 deg)
   
         }
         100%{
           transform :rotate(360 deg)
         }
      } 
      
    }
  .rotate{
    animation: img 5s both 0.3s linear  ;
  }  
  @keyframes img {
      0%{
        transform :rotate(0 deg)
      }
      50%{
        transform :rotate(180 deg)
        // transform :scale(1.2)
      }
      100%{
        transform :rotate(360 deg)
      }
  }  
  .from{
    display:flex;
    flex-direction :column;
    justify-content :center;
    align-items :center;
    width 400px
    
    p.title{
      font-size:28px;
    }
    .from-content{
      width 350px
      border:1px solid #ccc;
      border-radius :5px;
      padding:20px;
      
      .input_text{
        display:inline-block;
        height 40px
        line-height 40px;
        font-size:18px;
      }
      button{
        color:#fff;
        font-size:18px;
        letter-spacing :5px;
      }
      .message{
        color:#f00
      }
    }
    p.register{
      margin-top:15px;
      font-size:18px;
      width 350px
      border:1px solid #ccc;
      border-radius :5px;
      padding:10px;
    }
    
  }
}
</style>