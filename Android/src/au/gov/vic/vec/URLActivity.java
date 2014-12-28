package au.gov.vic.vec;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import au.gov.vic.vec.vvotewebview.R;

public class URLActivity extends Activity {

	@SuppressLint("SetJavaScriptEnabled")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_webview);
Log.i(getClass().getSimpleName(), "******************************************************** loading webview");		
		
		WebView webView = (WebView)findViewById(R.id.webView);

		webView.setInitialScale(1);
		webView.getSettings().setJavaScriptEnabled(true);
		webView.getSettings().setLoadWithOverviewMode(true);
		webView.getSettings().setUseWideViewPort(true);
		webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
		webView.setScrollbarFadingEnabled(false);
		
		webView.loadUrl("http://localhost:8081/vVote/index.html");
Log.i(getClass().getSimpleName(), "******************************************************** webview loaded");		
		try {
	      Log.i(getClass().getSimpleName(), "******************************************************** creating MyService");
	      Intent svc = new Intent(this, DownloadBundleService.class);
	      startService(svc);
	    } catch (Exception e) {
		  Log.e("START_SERVICE", "ui creation problem", e);
		}
	}

	@Override protected void onDestroy() {
	    super.onDestroy();
	    Intent svc = new Intent(this, DownloadBundleService.class);
	    stopService(svc);
	}
}
