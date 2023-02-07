$(()=>{
  if($('textarea#ta').length){
    CKEDITOR.replace('ta');
  }
  
  $('a.confirmedDeletion').on('click',(e)=>{
   if(!confirm('Confirmed Deletion')) 
   return false;
  })

});
