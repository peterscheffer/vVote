package au.gov.vic.vec;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class StartService extends Activity {
	@Override
	public void onCreate(Bundle icicle) {
	  super.onCreate(icicle);
	  try {
	      Intent svc = new Intent(this, DownloadBundleService.class);
	      startService(svc);
	  }
	  catch (Exception e) {
	    Log.e("START_SERVICE", "ui creation problem", e);
	  }

	}

	@Override protected void onDestroy() {
	  super.onDestroy();

	    Intent svc = new Intent(this, DownloadBundleService.class);
	    stopService(svc);
	}
}
