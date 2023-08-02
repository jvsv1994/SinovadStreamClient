


export class CustomListGeneric<T>{

totalCount:number;
itemsPerPage:number=10;
currentPage:number=1;
listItems:T[]=[];
listSelectedItems:T[]=[];
lastSelectedItem:T;
keyName='Id';

constructor(
) {
}

  public isSelectedAll(){

    if(this.listSelectedItems.length>0 && this.listSelectedItems.length==this.listItems.length)
    {
      return true;
    }else{
      return false;
    }
  }

  public isSelectedAny(){
    if(this.listSelectedItems.length>0 && this.listSelectedItems.length<this.listItems.length)
    {
      return true;
    }else{
      return false;
    }
  }

  public isSelectedNothing(){
    if(this.listSelectedItems.length==0)
    {
      return true;
    }else{
      return false;
    }
  }

  public onChangeSelectAllCheckBox(event:any){
    if(event.target.checked)
    {
      this.selectAll();
    }else{
      this.unselectAll();
    }
  }

  public selectAll(){
    for(let i=0;i < this.listItems.length;i++)
    {
      let item=this.listItems[i];
      this.listSelectedItems.push(item);
    }
  }

  public unselectAll(){
    this.listSelectedItems=[];
  }

  public onSelectItem(event:any,item:T)
  {
    let addItems:boolean=false;
    let index=this.listSelectedItems.findIndex(ele=>ele[this.keyName]==item[this.keyName]);
    if(index!=-1)
    {
      this.listSelectedItems.splice(index,1);
      addItems=false;
    }else{
      this.listSelectedItems.push(item);
      addItems=true;
    }
    if(event.shiftKey && this.lastSelectedItem)
    {
      let lastSelectedItemIndex=0
      if(this.listSelectedItems.length>0 && this.lastSelectedItem)
      {
        lastSelectedItemIndex=this.listItems.indexOf(this.lastSelectedItem);
      }
      let currentIndex=this.listItems.indexOf(item);
      if(addItems)
      {
        if(currentIndex>=lastSelectedItemIndex)
        {
          let listItemsToAdd=this.listItems.filter(item=>this.listItems.indexOf(item)<=currentIndex && this.listItems.indexOf(item)>=lastSelectedItemIndex && !this.isCheckedItem(item));
          this.listSelectedItems=this.listSelectedItems.concat(listItemsToAdd);
        }else{
          let listItemsToAdd=this.listItems.filter(item=>this.listItems.indexOf(item)>=currentIndex && this.listItems.indexOf(item)<=lastSelectedItemIndex && !this.isCheckedItem(item));
          this.listSelectedItems=this.listSelectedItems.concat(listItemsToAdd);
        }
      }else{
        let listItemsToUnselect=[];
        if(currentIndex>=lastSelectedItemIndex)
        {
          listItemsToUnselect=this.listItems.filter(item=>this.listItems.indexOf(item)<=currentIndex && this.listItems.indexOf(item)>=lastSelectedItemIndex && this.isCheckedItem(item));
        }else{
          listItemsToUnselect=this.listItems.filter(item=>this.listItems.indexOf(item)>=currentIndex && this.listItems.indexOf(item)<=lastSelectedItemIndex && this.isCheckedItem(item));
        }
        if(listItemsToUnselect && listItemsToUnselect.length>0)
        {
          listItemsToUnselect.forEach(element => {
            let index=this.listSelectedItems.findIndex(item=>item[this.keyName]==element[this.keyName]);
            if(index!=-1)
            {
              this.listSelectedItems.splice(index,1);
            }
          });
        }
      }
    }
    this.lastSelectedItem=item;
  }

  public isCheckedItem(item:T){
    let index=this.listSelectedItems.findIndex(ele=>ele[this.keyName]==item[this.keyName]);
    if(index!=-1)
    {
      return true;
    }else{
      return false;
    }
  }

  public getNewIndex(itemIndex:number,pageIndex:number,pageSize:number){
    var newIndex=(itemIndex+1)+((pageIndex-1)*pageSize);
    return newIndex;
  }

}
