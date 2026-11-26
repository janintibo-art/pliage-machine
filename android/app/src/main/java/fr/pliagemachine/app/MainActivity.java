package fr.pliagemachine.app;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.*;
import android.widget.Toast;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
public class MainActivity extends Activity {
    private WebView web; private ValueCallback<Uri[]> chooser; private String pending;
    @Override public void onCreate(Bundle b){super.onCreate(b);web=new WebView(this);setContentView(web);web.setBackgroundColor(0xff101820);WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(true);settings.setAllowFileAccessFromFileURLs(false);settings.setAllowUniversalAccessFromFileURLs(false);settings.setBlockNetworkLoads(true);web.addJavascriptInterface(new NativeFiles(),"NativeFiles");web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView w,WebResourceRequest r){return !r.getUrl().toString().equals("file:///android_asset/index.html");}@Override public boolean shouldOverrideUrlLoading(WebView w,String url){return !url.equals("file:///android_asset/index.html");}});web.setWebChromeClient(new WebChromeClient(){@Override public boolean onShowFileChooser(WebView w,ValueCallback<Uri[]> cb,FileChooserParams p){if(chooser!=null)chooser.onReceiveValue(null);chooser=cb;try{Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);i.addCategory(Intent.CATEGORY_OPENABLE);i.setType("*/*");startActivityForResult(i,101);return true;}catch(Exception e){chooser.onReceiveValue(null);chooser=null;return false;}}});web.loadUrl("file:///android_asset/index.html");}
    public class NativeFiles { @JavascriptInterface public void save(String data){if(data==null||data.length()>3000000)return;runOnUiThread(()->{if(pending!=null)return;pending=data;try{Intent i=new Intent(Intent.ACTION_CREATE_DOCUMENT);i.addCategory(Intent.CATEGORY_OPENABLE);i.setType("application/json");i.putExtra(Intent.EXTRA_TITLE,"pliage-machine-projet.json");startActivityForResult(i,102);}catch(Exception e){pending=null;Toast.makeText(MainActivity.this,"Export indisponible",Toast.LENGTH_LONG).show();}});} }
    @Override protected void onActivityResult(int req,int result,Intent data){super.onActivityResult(req,result,data);if(req==101&&chooser!=null){chooser.onReceiveValue(result==RESULT_OK&&data!=null&&data.getData()!=null?new Uri[]{data.getData()}:null);chooser=null;}if(req==102){String content=pending;pending=null;if(result==RESULT_OK&&data!=null&&data.getData()!=null&&content!=null){try(OutputStream out=getContentResolver().openOutputStream(data.getData(),"w")){if(out==null)throw new Exception("Flux indisponible");out.write(content.getBytes(StandardCharsets.UTF_8));Toast.makeText(this,"Sauvegarde exportée",Toast.LENGTH_SHORT).show();}catch(Exception e){Toast.makeText(this,"Échec de l’export",Toast.LENGTH_LONG).show();}}}}
    @Override protected void onDestroy(){if(chooser!=null){chooser.onReceiveValue(null);chooser=null;}web.removeJavascriptInterface("NativeFiles");web.destroy();super.onDestroy();}
}
