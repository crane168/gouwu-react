// 编译less
fis.match('**.less', {
	parser: 'less',
	rExt: '.css'
})
// 编译jsx
fis.match('**.jsx', {
	parser: 'babel2',
	rExt: '.js'
})