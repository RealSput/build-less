{
  "targets": [
    {
      "target_name": "native_rt",
      "sources": [ "timing.cc" ],
      "conditions":[
      	["OS=='linux'", {
      	  "sources": [ "performance_linux.cc" ]
      	  }],
      	["OS=='mac'", {
      	  "sources": [ "performance_mac.cc" ]
      	}],
        ["OS=='win'", {
      	  "sources": [ "performance_win.cc" ]
      	}]
      ], 
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}