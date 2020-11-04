// import path from 'path'
// import fs from 'fs'
// import CleanCSS from 'clean-css'
// import sass from 'node-sass'

// const sass = (opts) => {

//   const inFile = path.join(opts.root, 'website/stylesheets/default-layout.scss')
//   const outFile = path.join(opts.root, 'dist/css/default-layout.css')

//   sass.render({ file: inFile }, function(err, result) {
//     if (err) throw err
//     const output = new CleanCSS({}).minify(result.css.toString())
//     fs.writeFile(outFile, output.styles, function(err){
//       if (err) throw err
//       console.log(`Saved ${outFile}`)
//     });
//   });
// }

// export default sass
