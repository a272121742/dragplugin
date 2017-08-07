DragPlugin
==========

## HTML Document Mapping

```html
div.container
    div.btn-group
        input.grid.edit
        button.grid-save
        button.grid-load
        button.grid-clear
    div.container-fluid
        div.row
            div.col-md-2
                div.grid-stack grid-stack-2 grid-sidebar
            div.col-md-10
                div.grid-stack grid-stack-10 grid-center

```

## Requirements

- jquery >= 1.11.0
- jquery.ui >= 1.12.0
- bootstrap >= 3.0.0
- underscore >= 1.7


## Useage

```html
<link rel="stylesheet" href="./css/jquery-ui.min.css" />
<link rel="stylesheet" href="./css/bootstrap.min.css" />
<link rel="stylesheet" href="./css/gridstack.min.css" />
<link rel="stylesheet" href="./css/gridstack-extra.min.css"/>

<script src="./js/jquery.min.js"></script>
<script src="./js/jquery-ui.min.js"></script>
<script src="./js/underscore.min.js"></script>
<script src="./js/gridstack.all.js"></script>
<script src="./dragplugin.js"></script>

<script type="text/javascript">
    $(document).ready(function(){
        var option = {};
        var dragplugin = $('.container').dargplugin(option);
        /**
         *  options arguments
         *  sidebar : element class to rend sidebar
         *  center : element class to rend center
         *  edit : element class for edit action, it rend edit model on sidebar & center
         *  save : element class for save action, it can be save data on sidebar & center
         *  load : element class for load action, it can be load data on sidebar & center
         *  clear : element class for clear action, it can be clear all widget on sidebar & center
         *  remove : element class for remove action, it only remove widget on center
         */
    });
</script>
```

## dragplugin api

### edit(onEditModel : boolean)

argument of `onEditModel` is not `true`, will close darg model

### save()

save data with sidebar and center, if your called method `data()`, it can be auto saved

### load()

load data with sidebar and center

### clear()

clear all widget in your sidebar and center

### addWidget(grid : string, id : string, title : string, body : string, x : number, y : number, width : number, height : number)

add widget in your sidebar or center. the first argument named `grid` is element's class, maybe sidebar or center

### data(grid : string)

get serialized data on your sidebar or center, without grid element's class, your can get all serialized data








