<h1>UPLOAD YOUR LEVEL HERE</h1>
<form action="upload-level.controller" method="POST">
  <label>Level Slug: <input type="text" name="slug"></label><br>
  <label>Level Name: <input type="text" name="name"></label><br>
  <label>Level JSON:</label><br>
  <textarea name="level-data" rows="20" cols="80"></textarea><br>
  <button type="submit">Upload Level</button>
</form>