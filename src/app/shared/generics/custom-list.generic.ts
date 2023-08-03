import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
export class CustomListGeneric<T>{

refreshSubscription$:Subscription;
showLoading:boolean=true;
dataSource=new MatTableDataSource<T>;
selection = new SelectionModel<T>(true, []);
totalCount:number;
itemsPerPage:number=10;
currentPage:number=1;
listItems:T[]=[];
sortBy="Id";
sortDirection="asc";
searchText="";
searchBy="";
lastSelectedItem:T;

constructor(
  public matPaginatorIntl: MatPaginatorIntl
) {
  this.matPaginatorIntl.itemsPerPageLabel="Items por página";
  this.matPaginatorIntl.previousPageLabel="Página anterior";
  this.matPaginatorIntl.nextPageLabel="Página siguiente";
}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  public updatePageData(event:PageEvent){
    this.itemsPerPage=event.pageSize;
    this.currentPage=event.pageIndex+1;
  }

  public getElementNumber(itemIndex:number,pageIndex:number,pageSize:number){
    var newIndex=(itemIndex+1)+((pageIndex-1)*pageSize);
    return newIndex;
  }

  public onChangeCheckValue(event:any,item:T)
  {
    let addItems:boolean=event.target.checked;
    if(addItems)
    {
      this.selection.select(item);
    }else{
      this.selection.deselect(item);
    }
    if(event.shiftKey && this.lastSelectedItem)
    {
      let lastSelectedItemIndex=0
      if(this.selection.hasValue() && this.lastSelectedItem)
      {
        lastSelectedItemIndex=this.listItems.indexOf(this.lastSelectedItem);
      }
      let currentIndex=this.listItems.indexOf(item);
      if(addItems)
      {
        var listItemsToSelect=[];
        if(currentIndex>=lastSelectedItemIndex)
        {
          listItemsToSelect=this.listItems.filter(item=>this.listItems.indexOf(item)<=currentIndex && this.listItems.indexOf(item)>=lastSelectedItemIndex
          && !this.selection.isSelected(item));
        }else{
          listItemsToSelect=this.listItems.filter(item=>this.listItems.indexOf(item)>=currentIndex && this.listItems.indexOf(item)<=lastSelectedItemIndex
          && !this.selection.isSelected(item));
        }
        if(listItemsToSelect && listItemsToSelect.length>0)
        {
          this.selection.select(...listItemsToSelect);
        }
      }else{
        let listItemsToUnselect=[];
        if(currentIndex>=lastSelectedItemIndex)
        {
          listItemsToUnselect=this.listItems.filter(item=>this.listItems.indexOf(item)<=currentIndex && this.listItems.indexOf(item)>=lastSelectedItemIndex
           && this.selection.isSelected(item));
        }else{
          listItemsToUnselect=this.listItems.filter(item=>this.listItems.indexOf(item)>=currentIndex && this.listItems.indexOf(item)<=lastSelectedItemIndex
           && this.selection.isSelected(item));
        }
        if(listItemsToUnselect && listItemsToUnselect.length>0)
        {
          this.selection.deselect(...listItemsToUnselect);
        }
      }
    }
    this.lastSelectedItem=item;
  }

}
