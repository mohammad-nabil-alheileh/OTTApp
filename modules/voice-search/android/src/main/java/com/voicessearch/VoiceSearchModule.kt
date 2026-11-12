package com.voicessearch

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import java.util.Locale

/**
 * Launches the system speech recognizer (RecognizerIntent) and returns the
 * transcript. The system owns the microphone, so no RECORD_AUDIO permission is
 * needed. Resolves null when the user cancels or nothing is recognized.
 */
class VoiceSearchModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

  private var pendingPromise: Promise? = null

  init {
    reactContext.addActivityEventListener(this)
  }

  override fun getName() = "VoiceSearch"

  @ReactMethod
  fun isAvailable(promise: Promise) {
    val available = try {
      SpeechRecognizer.isRecognitionAvailable(reactContext) &&
        reactContext.packageManager
          .queryIntentActivities(
            Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0
          )
          .isNotEmpty()
    } catch (error: Exception) {
      false
    }
    promise.resolve(available)
  }

  @ReactMethod
  fun startListening(options: ReadableMap, promise: Promise) {
    if (pendingPromise != null) {
      promise.resolve(null)
      return
    }

    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.resolve(null)
      return
    }

    val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
      putExtra(
        RecognizerIntent.EXTRA_LANGUAGE_MODEL,
        RecognizerIntent.LANGUAGE_MODEL_FREE_FORM,
      )
      putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
      putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false)

      val locale = options.stringOrNull("locale")
      putExtra(
        RecognizerIntent.EXTRA_LANGUAGE,
        locale ?: Locale.getDefault().toLanguageTag(),
      )
      options.stringOrNull("prompt")?.let {
        putExtra(RecognizerIntent.EXTRA_PROMPT, it)
      }
    }
    // Several apps (e.g. Google TTS) may also claim RECOGNIZE_SPEECH, which
    // makes Android show a chooser dialog. Target the real recognizer directly.
    preferredRecognizerPackage(intent)?.let { intent.setPackage(it) }

    pendingPromise = promise
    activity.runOnUiThread {
      try {
        activity.startActivityForResult(intent, REQUEST_CODE)
      } catch (error: Exception) {
        pendingPromise = null
        promise.resolve(null)
      }
    }
  }

  override fun onActivityResult(
      activity: Activity,
      requestCode: Int,
      resultCode: Int,
      data: Intent?,
  ) {
    if (requestCode != REQUEST_CODE) {
      return
    }
    val promise = pendingPromise ?: return
    pendingPromise = null

    if (resultCode != Activity.RESULT_OK || data == null) {
      promise.resolve(null)
      return
    }

    val match = data
      .getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
      ?.firstOrNull()
      ?.trim()
      .orEmpty()
    promise.resolve(match.ifEmpty { null })
  }

  override fun onNewIntent(intent: Intent) = Unit

  override fun invalidate() {
    pendingPromise?.resolve(null)
    pendingPromise = null
    reactContext.removeActivityEventListener(this)
    super.invalidate()
  }

  private fun preferredRecognizerPackage(intent: Intent): String? {
    val packages = try {
      reactContext.packageManager
        .queryIntentActivities(intent, 0)
        .map { it.activityInfo.packageName }
        .distinct()
    } catch (error: Exception) {
      return null
    }
    if (packages.size <= 1) {
      return null
    }
    return PREFERRED_RECOGNIZERS.firstOrNull { it in packages }
  }

  private fun ReadableMap.stringOrNull(key: String): String? =
    if (hasKey(key) && !isNull(key)) getString(key) else null

  companion object {
    private const val REQUEST_CODE = 7711

    private val PREFERRED_RECOGNIZERS = listOf(
      "com.google.android.katniss", // Google TV / Android TV
      "com.google.android.googlequicksearchbox", // Google app (phones)
    )
  }
}
