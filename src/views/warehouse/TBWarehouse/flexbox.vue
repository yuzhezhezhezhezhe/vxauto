<template>
  <div class="page">
    <div class="list" v-for="(item, index) in list" :key="index">
      <img style="width: 100%;height: 100%" :src="item.img" class="user-avatar">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          img: 'http://img14.360buyimg.com/n0/jfs/t1/85943/8/9791/127970/5e12ac49E763cb9c2/210e233a91885809.jpg'
        },
        {
          img: 'http://img14.360buyimg.com/n0/jfs/t1/85943/8/9791/127970/5e12ac49E763cb9c2/210e233a91885809.jpg'
        },
        {
          img: 'http://img14.360buyimg.com/n0/jfs/t1/85943/8/9791/127970/5e12ac49E763cb9c2/210e233a91885809.jpg'
        },
        {
          img: 'http://img14.360buyimg.com/n0/jfs/t1/85943/8/9791/127970/5e12ac49E763cb9c2/210e233a91885809.jpg'
        },
        {
          img: 'http://img14.360buyimg.com/n0/jfs/t1/85943/8/9791/127970/5e12ac49E763cb9c2/210e233a91885809.jpg'
        },
        {
          img: 'http://img14.360buyimg.com/n0/jfs/t1/85943/8/9791/127970/5e12ac49E763cb9c2/210e233a91885809.jpg'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
  html,body{
    height:100%;
    margin:0;
  }
  .page{
    position:absolute;
    left:0;
    top:180px;
    right:0;
    bottom:0;
  }
  .list{
    float:left;
    height:20%;
    width:20%;
    position:relative;
  }
  .list:before{
    content:'';
    position:absolute;
    left:10px;
    right:10px;
    top:10px;
    bottom:10px;
    border-radius:10px;
  }
  .list:after{
    content:attr(data-index);
    position:absolute;
    height:30px;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin:auto;
    text-align:center;
    font:24px/30px bold 'microsoft yahei';
  }
</style>
